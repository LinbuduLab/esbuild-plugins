import {
  LightNodeServeExecutorSchema,
  NormalizedLightNodeServeExecutorSchema,
} from '../schema';

export const getNodeDevOptions = (schema: LightNodeServeExecutorSchema) => {
  // replace with Primitive
  const args: string[] = [
    `--ignore=${schema.ignore}`,
    // `--timestamp=${schema.timestamp}`,
    `--deps=${schema.deps}`,
    `--debounce=${schema.debounce}`,
    `--clear=${schema.clearConsole}`,
    // `--vm=${schema.vm}`,
    `--respawn=${schema.watch}`,
  ];

  return args;
};

export const getTsNodeOptions = (schema: LightNodeServeExecutorSchema) => {
  const args: string[] = [
    `--compiler=${schema.compiler}`,
    `--prefer-ts-exts=${schema.preferTsExts}`,
    `--transpile-only=${schema.transpileOnly}`,
    `--log-error=${schema.logError}`,
    `--skip-project=${schema.skipProject}`,
    `--skip-ignore=${schema.skipIgnore}`,
    `--emit=${schema.emit}`,
  ];

  if (schema.registerPath) {
    console.log('Make sure you`ve installed tsconfig-paths');
    args.push(`-r tsconfig-paths/register`);
  }

  args.push(`-P`, schema.tsConfig);

  return args;
};

export const getExecaOptions = (schema: LightNodeServeExecutorSchema) => {
  const args: string[] = [];
  return args;
};
