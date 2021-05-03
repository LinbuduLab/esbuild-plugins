import { ExecutorContext } from '@nrwl/devkit';
import type { DevkitExecSchema } from './types';
import path from 'path';
import { schemaProps } from './types';
import yargsParser from 'yargs-parser';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';

export const parseArgs = (options: DevkitExecSchema) => {
  // schema 中可以使用任意形式的选项格式，最终通过useCamelCase控制
  // 只需要支持camelCase和kebabCase这两个即可
  const transformer = options.useCamelCase ? camelCase : kebabCase;

  const args = options.args;

  // 将schema中多余的选项收集起来，如a:1，b:2,dry-run:true
  // 收集为{}的形式
  if (!args) {
    const unknownOptionsTreatedAsArgs = Object.keys(options)
      .filter((p) => schemaProps.indexOf(p) === -1)
      .map((p) => transformer(p))
      .reduce(
        (unknownOptionsMap, key) => (
          (unknownOptionsMap[key] = options[key]), unknownOptionsMap
        ),
        {} as Record<string, string>
      );

    options.useCamelCase
      ? delete unknownOptionsTreatedAsArgs['useCamelCase']
      : delete unknownOptionsTreatedAsArgs['use-camel-case'];

    console.log(
      `Extra options was regarded as command arguments: [${Object.keys(
        unknownOptionsTreatedAsArgs
      )}]`
    );

    return unknownOptionsTreatedAsArgs;
  }

  // passing unknown options to some libs will cause errors(like Prisma)
  const { _, ...parsedArgs } = yargsParser(args.replace(/(^"|"$)/g, ''), {
    configuration: {
      'camel-case-expansion': false,
    },
  });

  options.useCamelCase
    ? delete parsedArgs['useCamelCase']
    : delete parsedArgs['use-camel-case'];

  return parsedArgs;
};

export const normalizeCommand = (
  command: string,
  args: Record<string, string>,
  forwardAllArgs: boolean
) => {
  // {args.xxx} 会被args.xxx的值填充
  // 这里将会固定使用驼峰填充属性？
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
