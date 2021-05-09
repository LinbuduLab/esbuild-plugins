import { TargetConfiguration } from '@nrwl/devkit';
import { WorkspaceSetupGeneratorSchema } from '../schema';

export const setupTargets = (
  schema: WorkspaceSetupGeneratorSchema,
  appName: string,
  projectRoot: string,
  sourceRoot: string
) => {
  const nodeBuildTarget: TargetConfiguration = {
    executor: 'nx-plugin-workspace:node-build',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: `dist/${projectRoot}`,
      main: `${sourceRoot}/main.ts`,
      tsConfig: `${projectRoot}/tsconfig.app.json`,
      assets: [`${sourceRoot}/assets`],
      progress: true,
      verbose: true,
      enableAnalytics: true,
    },
    configurations: {
      production: {
        optimization: true,
        extractLicenses: true,
        inspect: false,
        fileReplacements: [
          {
            replace: `${sourceRoot}/environments/environment.ts`,
            with: `${sourceRoot}/environments/environment.prod.ts`,
          },
        ],
      },
    },
  };

  const nodeServeTarget: TargetConfiguration = {
    executor: 'nx-plugin-workspace:node-serve',
    options: { buildTarget: `${appName}:build` },
    configurations: {
      production: {
        buildTarget: `${appName}:build:production`,
      },
    },
  };

  const devTarget = {
    executor: 'nx-plugin-workspace:light-node-serve',
    outputs: ['{options.outputPath}'],
    options: {
      main: `${sourceRoot}/main.ts`,
      tsConfig: `${projectRoot}/tsconfig.app.json`,
    },
  };

  const execTarget = {
    executor: 'nx-plugin-workspace:exec',
    options: {
      command: 'echo "__JUST_EMPTY_WORKSPACE_EXEC__"',
      cwd: projectRoot,
      parallel: false,
      color: true,
      outputPath: `dist/${projectRoot}`,
      useCamelCase: false,
      useLocalPackage: true,
    },
  };

  return {
    build: schema.build ? nodeBuildTarget : undefined,
    serve: schema.serve ? nodeServeTarget : undefined,
    dev: schema.dev ? devTarget : undefined,
    exec: schema.exec ? execTarget : undefined,
  };
};
