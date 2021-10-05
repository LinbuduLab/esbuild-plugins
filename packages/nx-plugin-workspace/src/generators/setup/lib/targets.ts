import { TargetConfiguration } from '@nrwl/devkit';
import { WorkspaceSetupGeneratorSchema } from '../schema';

export const setupTargets = (
  schema: WorkspaceSetupGeneratorSchema,
  appName: string,
  projectRoot: string,
  projectSourceRoot: string
) => {
  const nodeBuildTarget: TargetConfiguration = {
    executor: 'nx-plugin-workspace:node-build',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: `${projectRoot}/dist`,
      main: `${projectSourceRoot}/main.ts`,
      tsConfig: `${projectRoot}/tsconfig.json`,
      assets: [`${projectSourceRoot}/assets`],
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
            replace: `${projectSourceRoot}/environments/environment.ts`,
            with: `${projectSourceRoot}/environments/environment.prod.ts`,
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

  const execTarget = {
    executor: 'nx-plugin-workspace:exec',
    options: {
      command: 'echo "__JUST_EMPTY_WORKSPACE_EXEC__"',
      cwd: projectRoot,
      parallel: false,
      color: true,
      outputPath: `${projectRoot}/dist`,
      useCamelCase: false,
      useLocalPackage: true,
    },
  };

  const devTarget = {
    executor: 'nx-plugin-workspace:exec',
    options: {
      command: 'ts-node-dev',
      cwd: projectRoot,
      parallel: false,
      color: true,
      outputPath: `${projectRoot}`,
      useCamelCase: false,
      useLocalPackage: true,
      shell: true,
      respawn: true,
      debounce: 200,
    },
  };

  return {
    build: schema.build ? nodeBuildTarget : undefined,
    serve: schema.serve ? nodeServeTarget : undefined,
    dev: schema.dev ? devTarget : undefined,
    exec: schema.exec ? execTarget : undefined,
  };
};
