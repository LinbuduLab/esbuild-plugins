import type { ESBuildExecutorSchema } from './schema';
import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { green } from 'chalk';
import path from 'path';

import type { BuildOptions } from 'esbuild';
import { esbuildDecoratorPlugin } from 'esbuild-plugin-decorator';
import { esbuildNodeExternalsPlugin } from 'esbuild-plugin-node-externals';
import { esbuildHashPlugin } from 'esbuild-plugin-hash';
import { esbuildFileSizePlugin } from 'esbuild-plugin-filesize';
import { esbuildAliasPathPlugin } from 'esbuild-plugin-alias-path';

import { Subject, zip } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import dayjs from 'dayjs';

import { runESBuild } from './lib/esbuild-runner';
import { runTSC } from './lib/tsc-runner';
import {
  pluginTitle,
  timeStamp,
  buildTimes,
  warning as warningTxt,
  error as errorTxt,
  plainText,
  success,
} from './lib/log';
import type { TscRunnerOptions } from './lib/types';
import { collectESBuildRunnerMessages } from './lib/message-fragments';

import { normalizeBuildExecutorOptions } from './lib/normalize-schema';
import { bufferUntil } from './lib/buffer-until';

export type ESBuildBuildEvent = {
  success: boolean;
};

export default function buildExecutor(
  rawOptions: ESBuildExecutorSchema,
  context: ExecutorContext
): AsyncIterableIterator<ESBuildBuildEvent> {
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

  const plugins = [
    esbuildDecoratorPlugin({
      // project config
      tsconfigPath: options.tsConfig,
      compiler: 'tsc',
      swcCompilerOptions: {
        jsc: { externalHelpers: true },
      },
    }),
    options.externalDependencies === 'all' && esbuildNodeExternalsPlugin(),
    esbuildAliasPathPlugin({
      aliases: options.aliases,
    }),
    // waiting for buildEnd hook
    // esbuildHashPlugin({
    //   dest: path.join(options.outputPath, 'main.[hash:8].js'),
    //   retainOrigin: false,
    // }),
    // esbuildFileSizePlugin(),
  ];

  const external = Array.isArray(options.externalDependencies)
    ? options.externalDependencies
    : [];

  const esbuildRunnerOptions: BuildOptions = {
    logLevel: options.logLevel,
    logLimit: options.logLimit,
    platform: options.platform,
    format: options.format,
    bundle: options.bundle,
    sourcemap: options.sourceMap,
    charset: 'utf8',
    color: true,
    conditions: options.watch ? ['development'] : ['production'],
    watch: options.watch,
    absWorkingDir: options.workspaceRoot,
    plugins,
    tsconfig: options.tsConfig,
    entryPoints: [options.main],
    outdir: options.outputPath,
    external,
    incremental: options.watch,
    banner: options.inserts.banner,
    footer: options.inserts.footer,
    metafile: options.metaFile,
    minify: options.minify,
  };

  let buildCounter = 1;

  const timeString = dayjs().format('H:mm:ss A');
  const prefix = `${pluginTitle('nx-plugin-esbuild')} ESBuild ${buildTimes(
    `[${buildCounter}]`
  )} ${timeStamp(timeString)}`;

  // TODO: enable specify watch dir
  // apps/app1/src
  const watchDir = `${options.workspaceRoot}/${options.projectSourceRoot}`;

  const esBuildSubscriber = runESBuild(
    {
      ...esbuildRunnerOptions,
      assets: options.assets,
    },
    watchDir
  ).pipe(
    tap(() => {
      buildCounter++;
    }),

    map(({ buildResult, buildFailure }) => {
      const messageFragments: string[] = [];

      collectESBuildRunnerMessages(
        { buildResult, buildFailure },
        messageFragments,
        prefix
      );

      return {
        success: !buildFailure,
        messageFragments,
      };
    })
  );

  // TODO: skip type check
  let typeCounter = 1;
  const tscBufferTrigger = new Subject<boolean>();

  const tscRunnerOptions: TscRunnerOptions = {
    tsconfigPath: options.tsConfig,
    // use watch option from ESBuild option
    watch: Boolean(esbuildRunnerOptions.watch),
    root: options.workspaceRoot,
  };

  const tscSubscriber = runTSC(tscRunnerOptions).pipe(
    tap(({ info, error, end }) => {
      // console.log('{ info, error, end }: ', { info, error, end });
    }),

    map(({ info, error, end }) => {
      const messageFragments: string[] = [];

      const timeString = dayjs().format('H:mm:ss A');

      const prefix = `${pluginTitle('nx-plugin-esbuild')} TSC ${buildTimes(
        `[${typeCounter}]`
      )} ${timeStamp(timeString)}`;

      let hasErrors = Boolean(error);

      if (error) {
        // FIXME: 多条错误时的格式化
        messageFragments.push(errorTxt(`${prefix} ${error}`));
      } else if (info) {
        if (info.match(/Found\s\d*\serror/)) {
          if (info.includes('Found 0 errors')) {
            messageFragments.push(
              success(`${prefix} ${info.replace(/\r\n/g, '')}`)
            );
          } else {
            hasErrors = true;
            messageFragments.push(
              errorTxt(`${prefix} ${info.replace(/\r\n/g, '')}`)
            );
          }
          tscBufferTrigger.next(true);
        } else {
          messageFragments.push(
            success(`${prefix} ${info.replace(/\r\n/g, '')}`)
          );
        }
      }
      return { info, error, end, hasErrors, messageFragments };
    }),

    bufferUntil(
      ({ info, error }) =>
        !!info?.match(/Found\s\d*\serror/) || error?.includes('error TS')
    ),

    tap(() => {
      typeCounter++;
    }),

    map((values) => {
      const message = values.map((value) => value.messageFragments).flat(1);

      return {
        success: !values.find((value) => value.hasErrors),
        message,
      };
    })
  );

  return eachValueFrom(
    zip(esBuildSubscriber, tscSubscriber).pipe(
      // tap(([_, tsc]) => {
      //   console.log('TSC Emit Value');
      // }),

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
