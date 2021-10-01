import type { ExecutorContext } from '@nrwl/devkit';
import type {
  TscRunnerOptions,
  RunnerSubcriber,
  ExecutorResponse,
} from './lib/types';
import { ESBuildExecutorSchema } from './schema';

import { bufferUntil, ensureProjectConfig } from 'nx-plugin-devkit';

import { zip, Observable, of, merge } from 'rxjs';
import { map, tap, startWith, catchError } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';

import dayjs from 'dayjs';
import fs from 'fs-extra';
import path from 'path';

import { runESBuild } from './lib/esbuild-runner';
import { runTSC } from './lib/tsc-runner';
import { timeStamp, buildTimes } from './lib/log';
import {
  collectESBuildRunnerMessages,
  collectTSCRunnerMessages,
} from './lib/message-fragments';
import { normalizeBuildExecutorOptions } from './lib/normalize-schema';
import { resolveESBuildOption } from './lib/resolve-esbuild-option';

import chalk from 'chalk';
import rimraf from 'rimraf';
import consola from 'consola';
import { DEFAULT_APP_LAYOUT, DEFAULT_LIB_LAYOUT } from './lib/constants';

export default function buildExecutor(
  rawOptions: ESBuildExecutorSchema,
  context: ExecutorContext
): AsyncIterableIterator<ExecutorResponse> | Promise<ExecutorResponse> {
  ensureProjectConfig(context);

  const { root, projectName, targetName, workspace } = context;

  const {
    root: projectRoot,
    sourceRoot: projectSourceRoot,
    projectType,
    targets,
  } = workspace.projects[projectName];

  // As in executor we cannot get `tree`.
  const projectLayout =
    projectRoot.split('/')[0] ?? projectType === 'application'
      ? DEFAULT_APP_LAYOUT
      : DEFAULT_LIB_LAYOUT;

  // normalize commob executor options
  const normalizedExecutorOptions = normalizeBuildExecutorOptions(rawOptions, {
    absoluteWorkspaceRoot: root,
    projectName,
    projectSourceRoot,
    projectRoot,
    projectLayout,
  });

  const {
    extendWatchOptions: watchOptions,
    outputPath,
    skipTypeCheck,
    watch,
    absoluteWorkspaceRoot,
    tsconfigPath,
    failFast,
    useMergeCombine,
    assets,
    watchDir,
    watchAssetsDir,
    verbose,
  } = normalizedExecutorOptions;

  // normalize ESBuild build options
  const esBuildOptions = resolveESBuildOption(normalizedExecutorOptions);

  let buildExecuteCount = 1;

  const esbuildRunnerPrefixCreator = () =>
    `${chalk.white('ESBuild')} ${buildTimes(
      `[${buildExecuteCount}]`
    )} ${timeStamp(dayjs().format('H:mm:ss A'))}`;

  const esBuildSubscriber: Observable<RunnerSubcriber> = runESBuild({
    ...esBuildOptions,
    assets,
    failFast,
    watchDir,
    watchOptions,
    watchAssetsDir,
    verbose,
    absoulteProjectRoot: path.join(absoluteWorkspaceRoot, projectRoot),
  }).pipe(
    tap(() => {
      buildExecuteCount++;
    }),

    map(({ buildResult, buildFailure }): RunnerSubcriber => {
      const messageFragments: string[] = [];

      collectESBuildRunnerMessages(
        { buildResult, buildFailure },
        messageFragments,
        esbuildRunnerPrefixCreator
      );

      if (skipTypeCheck) {
        messageFragments.unshift(
          `\n${chalk.white('ESBuild Compiler Starting')} ${chalk.yellow(
            '(Type Check Skipped)'
          )}...`
        );
      }

      return {
        success: !buildFailure,
        messageFragments,
      };
    })
  );

  // TODO: control by schema options
  if (outputPath && fs.existsSync(outputPath) && verbose) {
    rimraf.sync(outputPath);
    consola.info(`Output Path ${chalk.cyan(outputPath)} Cleaned. \n`);
  }

  const baseESBuildSubscriber = esBuildSubscriber.pipe(
    tap((buildResults: RunnerSubcriber) => {
      consola.log(buildResults.messageFragments.join('\n'));
    }),

    map((buildResults: RunnerSubcriber): ExecutorResponse => {
      return {
        success: buildResults?.success,
        outfile: path.join(outputPath, 'main.js'),
      };
    }),

    catchError(() => {
      return of<ExecutorResponse>({
        success: false,
        outfile: undefined,
      });
    })
  );

  if (!watch && skipTypeCheck) {
    return baseESBuildSubscriber.toPromise();
  }

  if (watch && skipTypeCheck) {
    return eachValueFrom<ExecutorResponse>(baseESBuildSubscriber);
  }

  let typeCheckCounter = 1;

  const tscRunnerPrefixCreator = () =>
    `${chalk.white('TypeScript')} ${buildTimes(
      `[${typeCheckCounter}]`
    )} ${timeStamp(dayjs().format('H:mm:ss A'))}`;

  const tscRunnerOptions: TscRunnerOptions = {
    root: absoluteWorkspaceRoot,
    tsconfigPath,
    watch,
    failFast,
    projectRoot,
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

      collectTSCRunnerMessages(res, messageFragments, tscRunnerPrefixCreator);

      return { info, error, end, hasErrors, messageFragments };
    }),

    bufferUntil(
      ({ info, error }) =>
        // info中获得Found 1 errors这样的字样，说明tsc走完了一次编译
        !!info?.match(/Found\s\d*\serror/) ||
        !!error?.match(/Found\s\d*\serror/)
    ),

    tap(() => {
      typeCheckCounter++;
    }),

    map((values) => {
      const message = values.map((value) => value.messageFragments).flat(1);

      return {
        success: !values.find((value) => value.hasErrors),
        messageFragments: message,
      };
    }),

    catchError(() => {
      return of<RunnerSubcriber>({
        success: false,
        messageFragments: [],
      });
    })
  );

  const baseSubscriber = useMergeCombine
    ? merge(esBuildSubscriber, tscSubscriber).pipe(
        startWith({
          success: true,
          messageFragments: [
            `${chalk.white('ESBuild Compiler Starting...')}`,
            `${chalk.white('TypeScript Checker Starting...\n')}`,
          ],
        }),
        tap((res: RunnerSubcriber) => {
          console.log(res.messageFragments.join('\n'));
        }),
        map((res): ExecutorResponse => {
          return {
            success: res?.success ?? true,
            outfile: path.join(outputPath, 'main.js'),
          };
        })
      )
    : zip(esBuildSubscriber, tscSubscriber).pipe(
        startWith([
          {
            success: true,
            messageFragments: [
              `${chalk.white('ESBuild Compiler Starting...\n')}`,
            ],
          },
          {
            success: true,
            messageFragments: [
              `${chalk.white('TypeScript Checker Starting...')}`,
            ],
          },
        ]),

        tap(([buildResults, tscResults]) => {
          console.log(tscResults.messageFragments.join(''));
          console.log(buildResults.messageFragments.join('\n'));
        }),

        map(([buildResults, tscResults]): ExecutorResponse => {
          return {
            success: buildResults?.success && tscResults?.success,
            outfile: path.join(outputPath, 'main.js'),
          };
        })
      );

  if (!watch) {
    return baseSubscriber.toPromise();
  }

  return eachValueFrom(baseSubscriber);
}
