import { ExecutorContext } from '@nrwl/devkit';
import type { DevkitExecSchema } from './types';
import path from 'path';
import { schemaProps } from './types';
import yargsParser from 'yargs-parser';
import execa from 'execa';
import { processEnv } from './env';

export function createExecaProcess(
  command: string,
  color: boolean,
  cwd: string
) {
  return new Promise((res, rej) => {
    const childProcess = execa(command, {
      env: processEnv(color),
      extendEnv: true,
      cwd,
      stdio: 'inherit',
    });

    const processExitListener = () => childProcess.kill();
    process.on('exit', processExitListener);
    process.on('SIGTERM', processExitListener);

    childProcess.on('exit', () => {
      res(childProcess.exitCode === 0);
    });
  });
}

export function createSyncExecaProcess(
  command: string,
  color: boolean,
  cwd: string
) {
  execa.sync(command, {
    env: processEnv(color),
    stdio: 'inherit',
    cwd,
  });
}

export const parseArgs = (options: DevkitExecSchema) => {
  const args = options.args;
  // 将多余的选项收集起来，如a:1，b:2,dry-run:true
  //
  if (!args) {
    const unknownOptionsTreatedAsArgs = Object.keys(options)
      .filter((p) => schemaProps.indexOf(p) === -1)
      .reduce((m, c) => ((m[c] = options[c]), m), {});

    // TODO: log here
    return unknownOptionsTreatedAsArgs;
  }

  return yargsParser(args.replace(/(^"|"$)/g, ''), {
    configuration: { 'camel-case-expansion': true },
  });
};

export const camelCase = (input: string) => {
  if (input.indexOf('-') > 1) {
    return input
      .toLowerCase()
      .replace(/-(.)/g, (_match, group1) => group1.toUpperCase());
  } else {
    return input;
  }
};

export const normalizeCommand = (
  command: string,
  args: Record<string, string>,
  forwardAllArgs: boolean
) => {
  if (command.indexOf('{args.') > -1) {
    const regex = /{args\.([^}]+)}/g;
    return command.replace(regex, (_, group: string) => args[camelCase(group)]);
  } else if (Object.keys(args).length > 0 && forwardAllArgs) {
    const stringifiedArgs = Object.keys(args)
      .map((a) => `--${a}=${args[a]}`)
      .join(' ');
    return `${command} ${stringifiedArgs}`;
  } else {
    return command;
  }
};

export function calculateCwd(
  cwd: string | undefined,
  context: ExecutorContext
): string {
  if (!cwd) return context.root;
  if (path.isAbsolute(cwd)) return cwd;
  return path.join(context.root, cwd);
}
