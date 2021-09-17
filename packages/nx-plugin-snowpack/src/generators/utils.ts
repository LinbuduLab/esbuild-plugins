import {
  joinPathFragments,
  NxJsonProjectConfiguration,
  ProjectConfiguration,
} from '@nrwl/devkit';

export const pluginSpecifiedTargets = (
  projectRoot: string
): (ProjectConfiguration & NxJsonProjectConfiguration)['targets'] => ({
  build: {
    executor: 'nx-plugin-snowpack:build',
    options: {
      root: projectRoot,
      configPath: 'snowpack.config.js',
      watch: true,
      clearCache: true,
      verbose: false,
      clean: true,
    },
  },
  serve: {
    executor: 'nx-plugin-snowpack:serve',
    options: {
      root: projectRoot,
      configPath: 'snowpack.config.js',
      verbose: false,
      clearCache: true,
      open: 'chrome',
    },
  },
});
