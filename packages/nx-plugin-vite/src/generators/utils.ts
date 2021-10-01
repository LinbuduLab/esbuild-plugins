import {
  joinPathFragments,
  NxJsonProjectConfiguration,
  ProjectConfiguration,
} from '@nrwl/devkit';

export const VITE_CONFIG_FILE = 'vite.config.ts';

export const pluginSpecifiedTargets = (
  projectRoot: string
): (ProjectConfiguration & NxJsonProjectConfiguration)['targets'] => {
  const configFile = joinPathFragments(projectRoot, VITE_CONFIG_FILE);
  return {
    serve: {
      executor: 'nx-plugin-vite:serve',
      options: {
        configFile,
        port: 3000,
        host: false,
        https: false,
      },
    },
    preview: {
      executor: 'nx-plugin-vite:preview',
      options: {
        configFile,
      },
    },
    build: {
      executor: 'nx-plugin-vite:build',
      options: {
        outDir: 'dist',
        configFile,
        watch: false,
        write: true,
        emitAtRootLevel: false,
        manifest: true,
      },
    },
  };
};
