import { ExecutorContext } from '@nrwl/devkit';
import { BuildOptions } from 'esbuild';
import {
  TscRunnerOptions,
  RunnerSubcriber,
  ESBuildBuildEvent,
  TscRunnerResponse,
} from './lib/types';
import { ESBuildExecutorSchema } from './schema';

import { bufferUntil, ensureProjectConfig } from 'nx-plugin-devkit';

import { zip, Observable } from 'rxjs';
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
import { resolveESBuildOption } from './lib/resolve-esbuild-option';

export default function buildExecutor(
  rawOptions: ESBuildExecutorSchema,
  context: ExecutorContext
): AsyncIterableIterator<ESBuildBuildEvent> {
  ensureProjectConfig(context);

  console.log('build!!!!!!!!!!!!!!!!!!!!!!!!');

  const {
    sourceRoot: projectSourceRoot,
    root: projectRoot,
  } = context.workspace.projects[context.projectName];

  const appsLayout = projectRoot.split('/')[0] ?? 'apps';

  const options = normalizeBuildExecutorOptions(
    rawOptions,
    context.root,
    context.projectName,
    projectSourceRoot,
    projectRoot,
    appsLayout
  );

  const esBuildOptions = resolveESBuildOption(options);

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
      ...esBuildOptions,
      assets: options.assets,
      failFast: options.failFast,
    },
    watchDir
  ).pipe(
    tap(() => {
      buildCounter++;
    }),

    // ESBuildRunnerResponse >>> RunnerSubcriber
    // FIXME:!
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
    tsconfigPath: options.tsconfigPath,
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
