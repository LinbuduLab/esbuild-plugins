import { ExecutorContext } from '@nrwl/devkit';
import {
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
import fs from 'fs-extra';
import rimraf from 'rimraf';
import consola from 'consola';

export default function buildExecutor(
  rawOptions: ESBuildExecutorSchema,
  context: ExecutorContext
): AsyncIterableIterator<ExecutorResponse> | Promise<ExecutorResponse> {
  console.log('111111');

  ensureProjectConfig(context);

  const { sourceRoot: projectSourceRoot, root: projectRoot } =
    context.workspace.projects[context.projectName];

  // As in executor we cannot get `tree`.
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

  const esbuildRunnerLogPrefix = () =>
    ` ${chalk.white('ESBuild')} ${buildTimes(`[${buildCounter}]`)} ${timeStamp(
      dayjs().format('H:mm:ss A')
    )}`;

  const esBuildSubscriber: Observable<RunnerSubcriber> = runESBuild({
    ...esBuildOptions,
    assets: options.assets,
    failFast: options.failFast,
    watchDir: options.watchDir,
    watchOptions: options.extendWatchOptions,
    watchAssetsDir: options.watchAssetsDir,
    verbose: options.verbose,
  }).pipe(
    tap(() => {
      buildCounter++;
    }),

    map(({ buildResult, buildFailure }): RunnerSubcriber => {
      const messageFragments: string[] = [];

      collectESBuildRunnerMessages(
        { buildResult, buildFailure },
        messageFragments,
        esbuildRunnerLogPrefix()
      );

      if (options.skipTypeCheck) {
        messageFragments.unshift(
          `ESBuild Compiler Starting ${chalk.yellow('(Type Check Skipped)')}...`
        );
      }

      return {
        success: !buildFailure,
        messageFragments,
      };
    })
  );

  if (options.clearOutputPath) {
    const { outputPath } = options;
    if (fs.existsSync(outputPath)) {
      rimraf.sync(outputPath);
      consola.info(`Output Path ${outputPath} Cleaned.`);
    }
  }

  const baseESBuildSubscriber = esBuildSubscriber.pipe(
    tap((buildResults: RunnerSubcriber) => {
      consola.log(buildResults.messageFragments.join('\n'));
    }),
    map((buildResults: RunnerSubcriber): ExecutorResponse => {
      return {
        success: buildResults?.success,
        // Will not be used in fact.
        outfile: path.join(options.outputPath, 'main.js'),
      };
    }),
    catchError(() => {
      return of<ExecutorResponse>({
        success: false,
        outfile: undefined,
      });
    })
  );

  if (!options.watch && options.skipTypeCheck) {
    return baseESBuildSubscriber.toPromise();
  }

  if (options.watch && options.skipTypeCheck) {
    return eachValueFrom<ExecutorResponse>(baseESBuildSubscriber);
  }

  let typeCounter = 1;

  const prefixTsc = () =>
    `${chalk.white('TypeScript')} ${buildTimes(`[${typeCounter}]`)} ${timeStamp(
      dayjs().format('H:mm:ss A')
    )}`;

  const tscRunnerOptions: TscRunnerOptions = {
    tsconfigPath: options.tsconfigPath,
    watch: options.watch,
    root: options.workspaceRoot,
    failFast: options.failFast,
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

    bufferUntil(
      ({ info, error }) =>
        // info中获得Found 1 errors这样的字样，说明tsc走完了一次编译
        !!info?.match(/Found\s\d*\serror/) ||
        !!error?.match(/Found\s\d*\serror/)
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
    }),

    catchError(() => {
      return of<RunnerSubcriber>({
        success: false,
        messageFragments: [],
      });
    })
  );

  const baseSubscriber = options.useMergeCombine
    ? merge(esBuildSubscriber, tscSubscriber).pipe(
        startWith({
          success: true,
          messageFragments: [
            `${chalk.white('ESBuild Compiler Starting...\n')}`,
            `${chalk.white('TypeScript Checker Starting...\n')}`,
          ],
        }),
        tap((res: RunnerSubcriber) => {
          console.log(res.messageFragments.join('\n'));
        }),
        map((res): ExecutorResponse => {
          return {
            success: res?.success ?? true,
            outfile: path.join(options.outputPath, 'main.js'),
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
              `${chalk.white('TypeScript Checker Starting...\n')}`,
            ],
          },
        ]),

        tap(([buildResults, tscResults]) => {
          console.log(tscResults.messageFragments.join('\n'));
          console.log(buildResults.messageFragments.join('\n'));
        }),

        map(([buildResults, tscResults]): ExecutorResponse => {
          return {
            success: buildResults?.success && tscResults?.success,
            outfile: path.join(options.outputPath, 'main.js'),
          };
        })
      );

  if (!options.watch) {
    return baseSubscriber.toPromise();
  }

  return eachValueFrom(baseSubscriber);
}
