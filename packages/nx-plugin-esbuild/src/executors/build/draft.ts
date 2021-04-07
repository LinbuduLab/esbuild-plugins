import { BuildExecutorSchema } from './schema';
import { ExecutorContext } from '@nrwl/devkit';
import { normalizeBuildOptions } from '../../utils/normalize-options';
import { pathExistsSync } from 'fs-extra';
import { readJsonFile } from '@nrwl/workspace';
import {
  build,
  BuildFailure,
  BuildOptions,
  BuildResult,
  InitializeOptions,
} from 'esbuild';
import { spawn } from 'child_process';
import { esbuildDecorators } from '@anatine/esbuild-decorators';
import { gray, green, red, yellow } from 'chalk';
import watch from 'node-watch';
import { Observable, OperatorFunction, Subject, zip } from 'rxjs';
import { buffer, delay, filter, map, share } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import { format } from 'date-fns';

export function buildExecutor(
  rawOptions: BuildExecutorSchema,
  context: ExecutorContext
): AsyncIterableIterator<{ success: boolean }> {
  const { sourceRoot, root } = context.workspace.projects[context.projectName];

  if (!sourceRoot) {
    throw new Error(`${context.projectName} does not have a sourceRoot.`);
  }

  if (!root) {
    throw new Error(`${context.projectName} does not have a root.`);
  }

  // Eventually, it would be great to expose more esbuild settings on command line.
  //  For now, the app root directory can utilize an esbuild.json file for build API settings
  //  https://esbuild.github.io/api/#build-api
  // esbuild json 配置
  const esBuildExists = pathExistsSync(`${root}/esbuild.json`);

  const esbuildConfig = esBuildExists
    ? readJsonFile<Partial<InitializeOptions>>(`${root}/esbuild.json`)
    : {};

  // 处理过的配置
  const options = normalizeBuildOptions(
    rawOptions,
    esbuildConfig,
    context.root,
    sourceRoot,
    root
  );

  const outdir = `${options.outputPath}`;

  // apps/app1/src
  const watchDir = `${options.root}/${options.sourceRoot}`;

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
      // 使用装饰器插件
      esbuildDecorators({
        cwd: options.root,
      }),
    ],
    // banner: {
    //   js: '// Compiled by esbuildnx ',
    // },
    tsconfig: options.tsConfig,
    entryPoints: [options.main],
    outdir,
    // outfile,
    ...esbuildConfig,
    incremental: options.watch || false,
  };

  let buildCounter = 1;
  const buildSubscriber = runBuild(esbuildOptions, watchDir).pipe(
    map(({ buildResult, buildFailure }) => {
      let message = '';
      const timeString = format(new Date(), 'h:mm:ss a');
      const count = gray(`[${buildCounter}]`);
      const prefix = `esbuild ${count} ${timeString}`;

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
  const tscSubscriber = runTsc({
    tsconfigPath: options.tsConfig,
    watch: options.watch || !!esbuildOptions.watch,
    root: options.root,
    useGlobal: false,
  }).pipe(
    map(({ info, error, end }) => {
      let message = '';
      let hasErrors = Boolean(error);
      const count = gray(`[${typeCounter}]`);
      const prefix = `tsc ${count}`;
      if (error) {
        message += red(`${prefix} ${error.replace(/\n/g, '')} \n`);
      } else if (info) {
        if (info.match(/Found\s\d*\serror/)) {
          if (info.includes('Found 0 errors')) {
            message += green(`${prefix} ${info.replace(/\n/g, '')} \n`);
          } else {
            hasErrors = true;
            message += yellow(`${prefix} ${info.replace(/\n/g, '')} \n`);
          }
          tscBufferTrigger.next(true);
        } else {
          message += green(`${prefix} ${info.replace(/\n/g, '')} \n`);
        }
      }
      return { info, error, end, message, hasErrors };
    }),
    bufferUntil(({ info }) => !!info?.match(/Found\s\d*\serror/)),
    // bufferUntil(({ info }) => true),
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

interface RunBuildResponse {
  buildResult: BuildResult | null;
  buildFailure: BuildFailure | null;
}

function runBuild(
  options: BuildOptions,
  watchDir?: string
): Observable<RunBuildResponse> {
  return new Observable<RunBuildResponse>((subscriber) => {
    const cwd = watchDir || options.absWorkingDir || process.cwd();
    // We will use the org watch settings with node-watch for better refresh performance
    const { watch: buildWatch, ...opts } = options;

    build(opts)
      .then((buildResult) => {
        subscriber.next({ buildResult, buildFailure: null });
        // Helper to send back data for watch events & supporting existing esbuild settings
        const watchNext = ({ buildFailure, buildResult }: RunBuildResponse) => {
          subscriber.next({ buildFailure, buildResult });
          if (typeof buildWatch === 'object' && buildWatch.onRebuild) {
            buildWatch.onRebuild(buildFailure, buildResult);
          }
        };
        // When in watch mode, it will continue to report back
        if (buildWatch) {
          watch(cwd, { recursive: true }, () => {
            buildResult
              .rebuild()
              .then((watchResult) => {
                watchNext({
                  buildFailure: null,
                  buildResult: watchResult,
                });
              })
              .catch((watchFailure: BuildFailure) => {
                watchNext({
                  buildFailure: watchFailure,
                  buildResult: null,
                });
              });
          });
        } else {
          subscriber.complete();
        }
      })
      .catch((buildFailure: BuildFailure) => {
        subscriber.next({ buildResult: null, buildFailure });
        subscriber.complete();
      });
  });
}

interface RunTscOptions {
  tsconfigPath: string;
  watch?: boolean;
  root?: string;
  useGlobal?: boolean;
}

function runTsc({ tsconfigPath, watch, root, useGlobal }: RunTscOptions) {
  return new Observable<{
    info?: string;
    error?: string;
    tscError?: Error;
    end?: string;
  }>((subscriber) => {
    // Build command
    const modeModulesPath = useGlobal
      ? ''
      : (root ? root + '/' : './') + 'node_modules/typescript/bin/';
    const command = `${modeModulesPath}tsc`;
    // Build arguments
    const args: string[] = ['--noEmit']; // --noEmit so as to not save out data
    if (watch) {
      args.push('-w');
    }
    args.push('-p');
    args.push(tsconfigPath);
    let errorCount = 0;
    // Run command
    const child = spawn(command, args, { shell: true });
    child.stdout.on('data', (data) => {
      const decoded = data.toString();
      // eslint-disable-next-line no-control-regex
      if (decoded.match(/\x1Bc/g)) return;
      if (decoded.includes('): error T')) {
        errorCount++;
        subscriber.next({ error: decoded });
      } else {
        subscriber.next({ info: decoded });
      }
    });
    child.stderr.on('error', (tscError) => {
      subscriber.next({ tscError });
    });
    child.stdout.on('end', () => {
      subscriber.next({
        info: `Type check complete. Found ${errorCount} errors`,
      });
    });
  });
}

function bufferUntil<T>(
  predicate: (value: T) => boolean
): OperatorFunction<T, T[]> {
  return function (source) {
    const share$ = source.pipe(share());
    const until$ = share$.pipe(filter(predicate), delay(0));
    return share$.pipe(buffer(until$));
  };
}

export default buildExecutor;
