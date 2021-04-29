import type { ExecutorContext } from '@nrwl/devkit';
import type { BuildOptions } from 'esbuild';
import type { Observable } from 'rxjs';
import { esbuildDecoratorPlugin } from 'esbuild-plugin-decorator';
import { esbuildNodeExternalsPlugin } from 'esbuild-plugin-node-externals';
import { esbuildFileSizePlugin } from 'esbuild-plugin-filesize';
import { esbuildAliasPathPlugin } from 'esbuild-plugin-alias-path';

import { bufferUntil } from 'nx-plugin-devkit';

import { zip } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import dayjs from 'dayjs';
import path from 'path';

import { runESBuild } from './lib/esbuild-runner';
import { runTSC } from './lib/tsc-runner';
import { pluginTitle, timeStamp, buildTimes } from './lib/log';
import {
  collectESBuildRunnerMessages,
  collectTSCRunnerMessages,
} from './lib/message-fragments';
import { normalizeBuildExecutorOptions } from './lib/normalize-schema';
import type { ESBuildBuildEvent, RunnerSubcriber, TscRunnerOptions } from "./lib/types";
import { a, func } from "./lib/types";
import type { ESBuildExecutorSchema, NormalizedESBuildExecutorSchema } from "./schema";

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
      // project owned tsconfig.json
      tsconfigPath: options.tsConfig,
      compiler: options.decoratorHandler,
      isNxProject: true,
      // swcCompilerOptions: {
      //   jsc: { externalHelpers: true },
      // },
    }),
    options.externalDependencies === 'all' && esbuildNodeExternalsPlugin(),
    esbuildAliasPathPlugin({
      aliases: options.aliases,
    }),
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

  const timeStringESBuild = dayjs().format('H:mm:ss A');
  const prefixESBuild = `${pluginTitle(
    'nx-plugin-esbuild'
  )} ESBuild ${buildTimes(`[${buildCounter}]`)} ${timeStamp(
    timeStringESBuild
  )}`;

  // TODO: enable specify watch dir
  // apps/app1/src
  const watchDir = `${options.workspaceRoot}/${options.projectSourceRoot}`;

  const esBuildSubscriber: Observable<RunnerSubcriber> = runESBuild(
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
        prefixESBuild
      );

      return {
        success: !buildFailure,
        messageFragments,
      };
    })
  );

  // TODO: skip type check
  let typeCounter = 1;
  const timeStringTsc = dayjs().format('H:mm:ss A');

  const prefixTsc = `${pluginTitle('nx-plugin-esbuild')} TSC ${buildTimes(
    `[${typeCounter}]`
  )} ${timeStamp(timeStringTsc)}`;

  const tscRunnerOptions: TscRunnerOptions = {
    tsconfigPath: options.tsConfig,
    // use watch option from ESBuild option
    watch: Boolean(esbuildRunnerOptions.watch),
    root: options.workspaceRoot,
  };

  const tscSubscriber: Observable<RunnerSubcriber> = runTSC(
    tscRunnerOptions
  ).pipe(
    map((res) => {
      const { info, error, end } = res;
      const messageFragments: string[] = [];

      let hasErrors = Boolean(error);

      if (
        info &&
        info.match(/Found\s\d*\serror/) &&
        !info.includes('Found 0 errors')
      ) {
        hasErrors = true;
      }

      collectTSCRunnerMessages(res, messageFragments, prefixTsc);

      return { info, error, end, hasErrors, messageFragments };
    }),

    bufferUntil(({ info, error }) =>
      // 原作者的意思应该是info中获得Found 1 errors这样的字样，说明tsc走完了一次编译
      {
        return (
          !!info?.match(/Found\s\d*\serror/) ||
          !!error?.match(/Found\s\d*\serror/)
        );
      }
    ),

    tap(() => {
      typeCounter++;
    }),

    map((values) => {
      const message = values.map((value) => value.messageFragments).flat(1);

      return {
        success: !values.find((value) => value.hasErrors),
        messageFragments: message,
      };
    })
  );

  return eachValueFrom(
    zip(esBuildSubscriber, tscSubscriber).pipe(
      map(([buildResults, tscResults]) => {
        console.log('\x1Bc');
        console.log(tscResults.messageFragments.join('\n'));
        console.log('\x1Bc');
        console.log(buildResults.messageFragments.join('\n'));
        return {
          success: buildResults?.success && tscResults?.success,
          outfile: path.join(options.outputPath, 'main.js'),
        };
      })
    )
  );
}
