import execa, { Options, ExecaChildProcess } from 'execa';
import path from 'path';
import { Plugin } from 'esbuild';
import fs from 'fs-extra';
import chalk from 'chalk';
import { ChildProcess } from 'child_process';

export interface RunOptions {
  execaOptions?: Options;
  customRunner?: (
    filePath: string
  ) => ChildProcess | ExecaChildProcess<string> | any;
}

export default (options: RunOptions = {}): Plugin => {
  let execaProcess: ChildProcess | ExecaChildProcess<string> | any;

  return {
    name: 'esbuild:run',
    async setup({ initialOptions, onEnd }) {
      if (
        typeof initialOptions.write === 'boolean' &&
        initialOptions.write === false
      ) {
        console.warn(
          chalk.yellow('WARN'),
          'ESBuild-Plugin-Run skipped because wtite option is set to be false'
        );
        return;
      }

      if (initialOptions.outdir && !initialOptions.outfile) {
        console.warn(
          chalk.yellow('WARN'),
          `ESBuild-Plugin-Run skipped because there are multiple outputs(outdir option is specified, ${initialOptions.outdir})`
        );
        return;
      }

      const filePath = path.join(process.cwd(), initialOptions.outfile);

      const runner = (execFilePath: string) => {
        if (execaProcess && !execaProcess?.killed) {
          execaProcess?.kill();
        }

        console.log(
          chalk.blue('i'),
          `ESBuild-Plugin-Run is executing file by ${chalk.cyan(
            options.customRunner ? 'customRunner' : 'execa.node'
          )}`
        );

        execaProcess = options.customRunner
          ? options.customRunner(execFilePath)
          : execa.node(execFilePath, {
              stdio: 'inherit',
              ...(options?.execaOptions ?? {}),
            });

        return execaProcess;
      };

      onEnd(async () => {
        if (!fs.existsSync(filePath)) {
          return;
        }

        execaProcess = runner(filePath);

        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        process.stdin.on('data', (data) => {
          const line = data.toString().trim().toLowerCase();
          if (line === 'rs' || line === 'restart') {
            execaProcess = runner(filePath);
          } else if (line === 'cls' || line === 'clear') {
            console.clear();
          }
        });
      });
    },
  };
};
