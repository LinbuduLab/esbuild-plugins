import { NxJsonProjectConfiguration, ProjectConfiguration } from '@nrwl/devkit';

export const SHARED_DEPS: Record<
  'dependencies' | 'devDependencies',
  Record<string, string>
> = {
  dependencies: {},
  devDependencies: {
    '@snowpack/plugin-dotenv': '^2.2.0',
    '@snowpack/plugin-typescript': '^1.2.1',
    '@snowpack/web-test-runner-plugin': '^0.2.2',
    '@types/snowpack-env': '^2.3.4',
    prettier: '^2.4.0',
    snowpack: '^3.3.7',
    typescript: '^4.2.4',
  },
};

export const FRAMEWORK_DEPS: Record<
  'react' | 'vue' | 'svelte',
  Record<'dependencies' | 'devDependencies', Record<string, string>>
> = {
  react: {
    dependencies: {
      react: '^17.0.2',
      'react-dom': '^17.0.2',
    },
    devDependencies: {
      '@snowpack/plugin-react-refresh': '^2.5.0',
      '@testing-library/react': '^12.1.0',
      '@types/chai': '^4.2.21',
      '@types/mocha': '^9.0.0',
      '@types/react': '^17.0.20',
      '@types/react-dom': '^17.0.9',
      '@web/test-runner': '^0.13.17',
      chai: '^4.3.4',
    },
  },
  vue: {
    dependencies: {
      vue: '^3.0.11',
    },
    devDependencies: {
      '@snowpack/plugin-vue': '^2.4.0',
    },
  },
  svelte: {
    dependencies: {
      svelte: '^3.37.0',
    },
    devDependencies: {
      '@snowpack/plugin-svelte': '^3.6.1',
      '@snowpack/web-test-runner-plugin': '^0.2.2',
      '@testing-library/svelte': '^3.0.3',
      '@tsconfig/svelte': '^1.0.10',
      '@types/chai': '^4.2.17',
      '@types/mocha': '^8.2.2',
      '@web/test-runner': '^0.13.3',
      chai: '^4.3.4',
      'svelte-preprocess': '^4.7.2',
    },
  },
};

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
