import {
  joinPathFragments,
  NxJsonProjectConfiguration,
  ProjectConfiguration,
} from '@nrwl/devkit';

export const VITE_CONFIG_FILE = 'vite.config.ts';

export const pluginSpecifiedTargets = (
  projectRoot: string
): (ProjectConfiguration & NxJsonProjectConfiguration)['targets'] => ({
  build: {
    executor: 'nx-plugin-vite:build',
    options: {
      root: projectRoot,
      outDir: 'dist',
      configFile: joinPathFragments(projectRoot, VITE_CONFIG_FILE),
      watch: false,
      emitAtRootLevel: false,
      manifest: true,
    },
  },
  serve: {
    executor: 'nx-plugin-vite:serve',
    options: {
      root: projectRoot,
      configFile: joinPathFragments(projectRoot, VITE_CONFIG_FILE),
    },
  },
});
