import path from 'path';

export type ESBuildPluginDecoratorOptions = {
  tsconfigPath: string;
  force: boolean;
  cwd: string;
  isNxProject: boolean;
  compiler: 'tsc' | 'swc';
  // TODO: support swc options
};

// TODO: enable use project ts config

export function normalizeOption(
  options: Partial<ESBuildPluginDecoratorOptions> = {}
): ESBuildPluginDecoratorOptions {
  const isNxProject = options.isNxProject ?? false;

  const tsconfigPath = options.tsconfigPath
    ? options.tsconfigPath
    : isNxProject
    ? path.join(process.cwd(), './tsconfig.base.json')
    : path.join(process.cwd(), './tsconfig.json');

  const cwd = options.cwd ?? process.cwd();
  const force = options.force ?? false;
  const compiler = options.compiler ?? 'tsc';

  return {
    tsconfigPath,
    force,
    cwd,
    isNxProject,
    compiler,
  };
}
