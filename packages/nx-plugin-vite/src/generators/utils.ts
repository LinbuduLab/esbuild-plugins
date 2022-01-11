import {
  joinPathFragments,
  NxJsonProjectConfiguration,
  ProjectConfiguration,
} from '@nrwl/devkit';

export const VITE_CONFIG_FILE = 'vite.config.ts';

console.log(11111);

export const REACT_DEPS = {
  dependencies: {
    react: '^17.0.0',
    'react-dom': '^17.0.0',
  },
  devDependencies: {
    '@types/react': '^17.0.0',
    '@types/react-dom': '^17.0.0',
    '@vitejs/plugin-react-refresh': '^1.3.6',
    typescript: '^4.3.2',
    vite: '^2.7.10',
  },
};

export const VUE_DEPS = {
  dependencies: {
    vue: '^3.2.16',
  },
  devDependencies: {
    '@vitejs/plugin-vue': '^2.0.1',
    typescript: '^4.4.3',
    vite: '^2.7.10',
    'vue-tsc': '^0.30.2',
  },
};

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
