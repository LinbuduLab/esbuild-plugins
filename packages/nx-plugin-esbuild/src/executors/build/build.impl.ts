import { ExecutorContext } from '@nrwl/devkit';
import { BuildOptions } from 'esbuild';
import { Observable } from 'rxjs';
import {
  TscRunnerOptions,
  RunnerSubcriber,
  ESBuildBuildEvent,
} from './lib/types';
import {
  ESBuildExecutorSchema,
  NormalizedESBuildExecutorSchema,
} from './schema';

import { esbuildPluginDecorator } from 'esbuild-plugin-decorator';
import { esbuildPluginNodeExternals } from 'esbuild-plugin-node-externals';
import { esbuildPluginAliasPath } from 'esbuild-plugin-alias-path';
// import { esbuildPluginFileSize } from 'esbuild-plugin-filesize';
// import { esbuildPluginIgnore } from 'esbuild-plugin-ignore-module';
// import { esbuildPluginNodePolyfill } from 'esbuild-plugin-node-polyfill';
// import { esbuildPluginNotifier } from 'esbuild-plugin-notifier';

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

import uniqBy from 'lodash/uniqBy';

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

  const appsLayout = projectRoot.split('/')[0] ?? 'apps';

  const options = normalizeBuildExecutorOptions(
    rawOptions,
    context.root,
    context.projectName,
    projectSourceRoot,
    projectRoot,
    appsLayout
  );

  const plugins = [
    esbuildPluginDecorator({
      tsconfigPath: options.tsConfig,
      compiler: options.decoratorHandler,
      isNxProject: true,
    }),
    options.externalDependencies === 'all' && esbuildPluginNodeExternals(),
    esbuildPluginAliasPath({
      alias: options.alias,
      tsconfigPath: options.tsConfig,
    }),
    // esbuildFileSizePlugin(),
  ].filter(Boolean);

  const external = Array.isArray(options.externalDependencies)
    ? options.externalDependencies
    : [];

  // 插件去重？
  const userConfigPlugins = options?.extendBuildOptions?.plugins ?? [];

  const decupedPlugins = uniqBy(
    [...plugins, ...userConfigPlugins],
    (plugin) => plugin.name
  );

  delete options.extendBuildOptions?.plugins;

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
    plugins: decupedPlugins,
    tsconfig: options.tsConfig,
    entryPoints: [options.main],
    outdir: options.outputPath,
    external,
    incremental: options.watch,
    banner: options.inserts.banner,
    footer: options.inserts.footer,
    metafile: options.metaFile,
    minify: options.minify,
    loader: options.loader,
    target: options.target,
    splitting: options.splitting,
    outExtension: options.outExtension,
    minifyIdentifiers: options.minify,
    minifyWhitespace: options.minify,
    minifySyntax: options.minify,
    inject: options.inject,
    define: options.define,
    ...options.extendBuildOptions,
  };

  let buildCounter = 1;

  const prefixESBuild = () =>
    `${pluginTitle('nx-plugin-esbuild')} ESBuild ${buildTimes(
      `[${buildCounter}]`
    )} ${timeStamp(dayjs().format('H:mm:ss A'))}`;

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

    // ESBuildRunnerResponse >>> RunnerSubcriber
    map(({ buildResult, buildFailure }) => {
      const messageFragments: string[] = [];

      collectESBuildRunnerMessages(
        { buildResult, buildFailure },
        messageFragments,
        prefixESBuild()
      );

      return {
        success: !buildFailure,
        messageFragments,
      };
    })
  );

  if (options.skipTypeCheck) {
    return eachValueFrom(
      esBuildSubscriber.pipe(
        map((buildResults) => {
          console.log(buildResults.messageFragments.join('\n'));
          return {
            success: buildResults?.success,
            outfile: path.join(options.outputPath, 'main.js'),
          };
        })
      )
    );
  }

  let typeCounter = 1;

  const prefixTsc = () =>
    `${pluginTitle('nx-plugin-esbuild')} TSC ${buildTimes(
      `[${typeCounter}]`
    )} ${timeStamp(dayjs().format('H:mm:ss A'))}`;

  const tscRunnerOptions: TscRunnerOptions = {
    tsconfigPath: options.tsConfig,
    watch: options.watch,
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

      collectTSCRunnerMessages(res, messageFragments, prefixTsc());

      return { info, error, end, hasErrors, messageFragments };
    }),

    bufferUntil(({ info, error }) =>
      // info中获得Found 1 errors这样的字样，说明tsc走完了一次编译
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
        console.log(tscResults.messageFragments.join('\n'));
        console.log(buildResults.messageFragments.join('\n'));
        return {
          success: buildResults?.success && tscResults?.success,
          outfile: path.join(options.outputPath, 'main.js'),
        };
      })
    )
  );
}
