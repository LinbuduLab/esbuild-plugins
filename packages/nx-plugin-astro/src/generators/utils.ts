import {
  joinPathFragments,
  NxJsonProjectConfiguration,
  ProjectConfiguration,
} from '@nrwl/devkit';

export const ASTRO_CONFIG_FILE = 'astro.config.mjs';

export const DEPS = {
  dependencies: {},
  devDependencies: {
    '@astrojs/renderer-preact': '^0.2.0',
    '@astrojs/renderer-react': '^0.2.0',
    '@astrojs/renderer-solid': '^0.1.0',
    '@astrojs/renderer-svelte': '^0.1.1',
    '@astrojs/renderer-vue': '^0.1.5',
    '@types/react': '^17.0.15',
    astro: '^0.18.4',
  },
};

export const pluginSpecifiedTargets = (
  projectRoot: string
): (ProjectConfiguration & NxJsonProjectConfiguration)['targets'] => {
  const configFile = joinPathFragments(projectRoot, ASTRO_CONFIG_FILE);
  return {
    dev: {
      executor: 'nx-plugin-workspace:exec',
      options: {
        command: 'astro dev',
        cwd: projectRoot,
        parallel: false,
        color: true,
        useCamelCase: false,
        useLocalPackage: true,
        shell: true,
      },
    },
    build: {
      executor: 'nx-plugin-workspace:exec',
      options: {
        command: 'astro build',
        cwd: projectRoot,
        parallel: false,
        color: true,
        useCamelCase: false,
        useLocalPackage: true,
        shell: true,
      },
    },
  };
};
