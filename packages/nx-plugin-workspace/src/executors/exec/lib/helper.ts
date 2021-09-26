import { ExecutorContext } from '@nrwl/devkit';
import path from 'path';
import { internalSchemaProps, WorkspaceExecSchema } from './types';
import yargsParser from 'yargs-parser';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import consola from 'consola';
import chalk from 'chalk';

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const debug = require('debug')('nx-plugin-workspace');

export const parseArgs = (options: WorkspaceExecSchema) => {
  const { args: argsSchemaOption, useCamelCase, ignoreFalsy } = options;

  // support `--some-arg` or `--someArg`, controlled by useCamelCase option
  const [transformer, resetter] = useCamelCase
    ? [camelCase, kebabCase]
    : [camelCase, kebabCase].reverse();

  // if `--args` is not provided, we collect all addtional arguments
  // make it as object form, with transformed key: value
  if (!argsSchemaOption) {
    const unknownOptionsTreatedAsArgs: Record<string, string> = Object.keys(
      options
    )
      // options that doesnot consumed by exec executor itself
      .filter((p) => internalSchemaProps.indexOf(p) === -1)
      // apply transformer, be default we use kebab case.
      .reduce((unknownOptionsMap, key) => {
        ignoreFalsy
          ? options[key]
            ? (unknownOptionsMap[transformer(key)] = options[key])
            : void 0
          : (unknownOptionsMap[transformer(key)] = options[key]);

        return unknownOptionsMap;
      }, {} as Record<string, string>);

    consola.info(
      `Extra options was regarded as command arguments: ${chalk.white(
        Object.keys(unknownOptionsTreatedAsArgs).join(', ')
      )}`
    );

    return unknownOptionsTreatedAsArgs;
  }

  // if `--args` is specified, we need to handle it, and ignore extra option args
  // passing unknown options to some libs will cause errors(like Prisma)
  // so we remove extra args at first
  const { _, ...parsedArgs } = yargsParser(
    argsSchemaOption.replace(/(^"|"$)/g, ''),
    {
      configuration: {
        // do not expand camel case
        // options.useCamelCase should be ignore here
        'camel-case-expansion': false,
      },
    }
  );

  // do not apply transform to it because it comes from the user!

  return parsedArgs;
};

export const normalizeCommand = (
  command: string,
  args: Record<string, string>,
  forwardAllArgs: boolean
) => {
  // fill command --aaa={args.foo} from args: "--foo=bar"
  if (command.indexOf('{args.') > -1) {
    const regex = /{args\.([^}]+)}/g;
    return command.replace(regex, (_, group: string) => args[group]);
    // if forwardAllArgs, attach all args
  } else if (Object.keys(args).length > 0 && forwardAllArgs) {
    const stringifiedArgs = Object.keys(args)
      .map((arg) => `--${arg}=${args[arg]}`)
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
