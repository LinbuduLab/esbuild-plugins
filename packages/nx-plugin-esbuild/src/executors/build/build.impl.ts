import { ESBuildExecutorSchema } from './schema';
import { ExecutorContext } from '@nrwl/devkit';

import { pathExistsSync } from 'fs-extra';
import { readJsonFile } from '@nrwl/workspace';
import { BuildOptions, InitializeOptions } from 'esbuild';
import { esbuildDecoratorPlugin } from 'esbuild-plugin-decorator';
import { gray, green, red, yellow } from 'chalk';
import { esbuildPluginNodeExternals } from 'esbuild-plugin-node-externals';

import { Subject, zip } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import dayjs from 'dayjs';

import { runESBuild } from './lib/esbuild-runner';
import { runTSC } from './lib/tsc-runner';

import { normalizeBuildExecutorOptions } from './lib/normalize-option';
import { bufferUntil } from './lib/buffer-until';

export function buildExecutor(
  rawOptions: ESBuildExecutorSchema,

  context: ExecutorContext
): AsyncIterableIterator<{ success: boolean }> {
  const { sourceRoot, root } = context.workspace.projects[context.projectName];

  if (!sourceRoot) {
    throw new Error(`${context.projectName} does not have a sourceRoot.`);
  }

  if (!root) {
    throw new Error(`${context.projectName} does not have a root.`);
  }

  // esbuild json 配置
  const esBuildExists = pathExistsSync(`${root}/esbuild.json`);

  const esbuildConfig = esBuildExists
    ? readJsonFile<Partial<InitializeOptions>>(`${root}/esbuild.json`)
    : {};

  const options = normalizeBuildExecutorOptions(
    rawOptions,
    esbuildConfig,
    context.root,
    sourceRoot,
    root
  );

  // dist/apps/app1
  const outdir = `${options.outputPath}`;

  // apps/app1/src
  const watchDir = `${options.root}/${options.sourceRoot}`;

  // esbuild 构建配置
  const esbuildOptions: BuildOptions = {
    logLevel: 'silent',
    platform: 'node',
    bundle: options.bundle || true,
    sourcemap: 'external',
    charset: 'utf8',
    color: true,
    conditions: options.watch ? ['development'] : ['production'],
    watch: options.watch || false,
    absWorkingDir: options.root,
    plugins: [
      esbuildDecoratorPlugin({
        cwd: options.root,
      }),
      esbuildPluginNodeExternals({
        packagePaths: options.packageJson ?? undefined,
      }),
    ],
    tsconfig: options.tsConfig,
    entryPoints: [options.main],
    outdir,
    banner: options.esbuild.banner,
    footer: options.esbuild.footer,
    ...esbuildConfig,

    external: [],
    incremental: options.watch || false,
  };

  // 已执行构建的次数？
  let buildCounter = 1;
  const buildSubscriber = runESBuild(
    {
      ...esbuildOptions,
      assets: options.assets,
    },
    watchDir
  ).pipe(
    map(({ buildResult, buildFailure }) => {
      let message = '';
      const timeString = dayjs().format('H:mm:ss A');
      const count = gray(`[${buildCounter}]`);
      const prefix = ` [nx-plugin-esbuild] esbuild ${count} ${timeString}`;

      // const warnings: string[] = [];

      if (buildResult?.warnings.length > 0) {
        let warningMessage = yellow(`${prefix} - Warnings:`);
        buildResult?.warnings.forEach((warning) => {
          warningMessage += `\n  ${yellow(warning.location.file)}(${
            warning.location.line
          },${warning.location.column}):`;
          warningMessage += `  ${warning.location.lineText.trim()}`;
          warningMessage += gray(`\n  ${warning.text}\n`);
        });
        // console.log(warningMessage);
        message += warningMessage;
      }

      if (buildFailure) {
        // console.log(red(`\nEsbuild Error ${count}`));
        // console.error(stats.buildFailure);
        message += red(`Esbuild Error ${count}`);
        message += buildFailure;
      } else if (buildResult?.warnings.length > 0) {
        message += green(
          `${prefix} - Build finished with ${yellow(
            buildResult?.warnings.length
          )} warnings. \n`
        );
      } else {
        message += green(`${prefix} - Build finished \n`);
      }

      buildCounter++;
      return {
        success: !buildFailure,
        message,
      };
    })
  );

  let typeCounter = 1;
  const tscBufferTrigger = new Subject<boolean>();
  const tscSubscriber = runTSC({
    tsconfigPath: options.tsConfig,
    watch: options.watch || !!esbuildOptions.watch,
    root: options.root,
  }).pipe(
    tap(({ info, error, end }) => {
      // console.log('{ info, error, end }: ', { info, error, end });
    }),

    map(({ info, error, end }) => {
      let message = '';
      let hasErrors = Boolean(error);
      const count = gray(`[${typeCounter}]`);
      const prefix = ` [nx-plugin-esbuild] tsc ${count}`;
      if (error) {
        // FIXME: 多条错误时的格式化
        message += red(`${prefix} ${error.replace(/\n/g, '')} \n`);
      } else if (info) {
        console.log('info: ', info);
        if (info.match(/Found\s\d*\serror/)) {
          if (info.includes('Found 0 errors')) {
            message += green(`${prefix} ${info.replace(/\r\n/g, '')} \n`);
          } else {
            hasErrors = true;
            message += yellow(`${prefix} ${info.replace(/\r\n/g, '')} \n`);
          }
          tscBufferTrigger.next(true);
        } else {
          message += green(`${prefix} ${info.replace(/\r\n/g, '')} \n`);
        }
      }
      return { info, error, end, message, hasErrors };
    }),

    bufferUntil(({ info }) => !!info?.match(/Found\s\d*\serror/)),

    map((values) => {
      typeCounter++;
      let message = '';
      values.forEach((value) => (message += value.message));
      // console.log(message);
      return {
        success: !values.find((value) => value.hasErrors),
        message,
      };
    })
  );

  return eachValueFrom(
    zip(buildSubscriber, tscSubscriber).pipe(
      map(([buildResults, tscResults]) => {
        console.log('\x1Bc');
        console.log(tscResults.message);
        console.log(buildResults.message);
        return {
          success: buildResults?.success && tscResults?.success,
        };
      })
    )
  );
}

export default buildExecutor;
