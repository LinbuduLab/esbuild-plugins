import { NxJsonProjectConfiguration, ProjectConfiguration } from '@nrwl/devkit';

export const pluginSpecifiedTargets = (
  projectRoot: string
): (ProjectConfiguration & NxJsonProjectConfiguration)['targets'] => ({
  serve: {
    executor: 'nx-plugin-snowpack:serve',
    options: {
      root: projectRoot,
      configPath: 'snowpack.config.mjs',
      verbose: false,
      clearCache: true,
      open: 'chrome',
    },
  },
  build: {
    executor: 'nx-plugin-snowpack:build',
    options: {
      root: projectRoot,
      configPath: 'snowpack.config.mjs',
      watch: true,
      clearCache: true,
      verbose: false,
      clean: true,
    },
  },
});
