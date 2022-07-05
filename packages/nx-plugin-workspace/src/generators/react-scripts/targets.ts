import { ProjectConfiguration } from '@nrwl/devkit';

export const pluginSpecifiedTargets = (
  projectRoot: string
): ProjectConfiguration['targets'] => {
  return {
    start: {
      executor: 'nx-plugin-workspace:exec',
      options: {
        commands: ['react-scripts start'],
        cwd: projectRoot,
        parallel: false,
        useLocalPackage: true,
        shell: true,
      },
    },
    build: {
      executor: 'nx-plugin-workspace:exec',
      options: {
        commands: ['react-scripts build'],
        cwd: projectRoot,
        parallel: false,
        useLocalPackage: true,
        shell: true,
      },
    },
    eject: {
      executor: 'nx-plugin-workspace:exec',
      options: {
        commands: ['react-scripts eject'],
        cwd: projectRoot,
        parallel: false,
        useLocalPackage: true,
        shell: true,
      },
    },
  };
};
