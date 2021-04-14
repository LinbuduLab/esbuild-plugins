import type { ESBuildExecutorSchema } from './schema';
import { ExecutorContext } from '@nrwl/devkit';
import path from 'path';
import { gray, green, red, yellow } from 'chalk';

import type { BuildOptions } from 'esbuild';
import { esbuildDecoratorPlugin } from 'esbuild-plugin-decorator';
import { esbuildNodeExternalsPlugin } from 'esbuild-plugin-node-externals';
import { esbuildHashPlugin } from 'esbuild-plugin-hash';
import { esbuildFileSizePlugin } from 'esbuild-plugin-filesize';

import { Subject, zip } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import dayjs from 'dayjs';

import { runESBuild } from './lib/esbuild-runner';
import { runTSC } from './lib/tsc-runner';
import {
  pluginTitleContainer,
  timeStampContainer,
  buildTimesContainer,
  warningContainer,
  errorContainer,
  plainTextContainer,
  successContainer,
} from './lib/log';

import { normalizeBuildExecutorOptions } from './lib/normalize-option';
import { bufferUntil } from './lib/buffer-until';

export default function buildExecutor(
  rawOptions: ESBuildExecutorSchema,
  context: ExecutorContext
): AsyncIterableIterator<{ success: boolean }> {
  const {
    sourceRoot: projectSourceRoot,
    root: projectRoot,
  } = context.workspace.projects[context.projectName];

  if (!projectSourceRoot) {
    throw new Error(`${context.projectName} does not have a sourceRoot.`);
  }

  if (!projectRoot) {
    throw new Error(`${context.projectName} does not have a root.`);
  }

  const options = normalizeBuildExecutorOptions(
    rawOptions,
    context.root,
    context.projectName,
    projectSourceRoot,
    projectRoot
  );

  // dist/apps/app1
  const outdir = `${options.outputPath}`;

  // TODO: specify watch dir
  // apps/app1/src
  const watchDir = `${options.workspaceRoot}/${options.sourceRoot}`;

  // esbuild 构建配置
  const esbuildRunnerOptions: BuildOptions = {
    logLevel: 'silent',
    platform: 'node',
    bundle: options.bundle,
    sourcemap: 'external',
    charset: 'utf8',
    color: true,
    conditions: options.watch ? ['development'] : ['production'],
    watch: options.watch,
    absWorkingDir: options.workspaceRoot,
    plugins: [
      esbuildDecoratorPlugin({
        cwd: options.workspaceRoot,
        tsconfigPath: options.tsConfig,
      }),
      esbuildNodeExternalsPlugin({
        packagePaths: options.packageJson ?? undefined,
      }),
      // waiting for buildEnd hook
      // esbuildHashPlugin({
      //   dest: path.join(options.outputPath, 'main.[hash:8].js'),
      //   retainOrigin: false,
      // }),
      // esbuildFileSizePlugin(),
    ],
    tsconfig: options.tsConfig,
    entryPoints: [options.main],
    outdir,
    ...options.esbuild,
    external: [],
    incremental: options.watch || false,
  };

  // 已执行构建的次数？
  let buildCounter = 1;
  const buildSubscriber = runESBuild(
    {
      ...esbuildRunnerOptions,
      assets: options.assets,
    },
    watchDir
  ).pipe(
    map(({ buildResult, buildFailure }) => {
      const messageFragments: string[] = [];

      const timeString = dayjs().format('H:mm:ss A');

      const prefix = `${pluginTitleContainer(
        'nx-plugin-esbuild'
      )} ESBuild ${buildTimesContainer(
        `[${buildCounter}]`
      )} ${timeStampContainer(timeString)}`;

      if (buildResult?.warnings.length > 0) {
        messageFragments.push(warningContainer(`${prefix} - Warnings:`));

        buildResult?.warnings.forEach((warning) => {
          const {
            location: { file, line, column, lineText },
            text,
          } = warning;
          messageFragments.push(
            warningContainer(`${file} ${line}, ${column}:`)
          );
          messageFragments.push(warningContainer(lineText.trim()));
          messageFragments.push(plainTextContainer(text));
        });
      }

      if (buildFailure) {
        messageFragments.push(errorContainer(prefix));
        buildFailure.errors.forEach((error) => {
          messageFragments.push(errorContainer(error.text));
        });
      } else if (buildResult?.warnings.length > 0) {
        messageFragments.push(
          successContainer(
            `${prefix} - Build Complete with ${warningContainer(
              String(buildResult?.warnings.length)
            )} warnings. `
          )
        );
      } else {
        messageFragments.push(green(`${prefix} - Build Complete. \n`));
      }

      buildCounter++;

      return {
        success: !buildFailure,
        messageFragments,
      };
    })
  );

  let typeCounter = 1;
  const tscBufferTrigger = new Subject<boolean>();
  const tscSubscriber = runTSC({
    tsconfigPath: options.tsConfig,
    watch: options.watch || !!esbuildRunnerOptions.watch,
    root: options.workspaceRoot,
  }).pipe(
    tap(({ info, error, end }) => {
      // console.log('{ info, error, end }: ', { info, error, end });
    }),

    map(({ info, error, end }) => {
      const messageFragments: string[] = [];

      const timeString = dayjs().format('H:mm:ss A');

      const prefix = `${pluginTitleContainer(
        'nx-plugin-esbuild'
      )} TSC ${buildTimesContainer(`[${typeCounter}]`)} ${timeStampContainer(
        timeString
      )}`;

      let hasErrors = Boolean(error);

      if (error) {
        // FIXME: 多条错误时的格式化
        messageFragments.push(errorContainer(`${prefix} ${error}`));
      } else if (info) {
        if (info.match(/Found\s\d*\serror/)) {
          if (info.includes('Found 0 errors')) {
            messageFragments.push(
              successContainer(`${prefix} ${info.replace(/\r\n/g, '')}`)
            );
          } else {
            hasErrors = true;
            messageFragments.push(
              errorContainer(`${prefix} ${info.replace(/\r\n/g, '')}`)
            );
          }
          tscBufferTrigger.next(true);
        } else {
          messageFragments.push(
            successContainer(`${prefix} ${info.replace(/\r\n/g, '')}`)
          );
        }
      }
      return { info, error, end, hasErrors, messageFragments };
    }),

    bufferUntil(
      ({ info, error }) =>
        !!info?.match(/Found\s\d*\serror/) || error?.includes('error TS')
    ),

    map((values) => {
      typeCounter++;

      const message = values.map((value) => value.messageFragments).flat(1);

      return {
        success: !values.find((value) => value.hasErrors),
        message,
      };
    })
  );

  return eachValueFrom(
    zip(buildSubscriber, tscSubscriber).pipe(
      tap(([_, tsc]) => {
        console.log('TSC Emit Value');
      }),

      map(([buildResults, tscResults]) => {
        console.log('\x1Bc');
        console.log(tscResults.message.join('\n'));
        console.log(buildResults.messageFragments.join('\n'));
        return {
          success: buildResults?.success && tscResults?.success,
        };
      })
    )
  );
}
