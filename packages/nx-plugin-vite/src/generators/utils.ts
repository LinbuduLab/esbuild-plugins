import { ProjectConfiguration, joinPathFragments } from '@nrwl/devkit';

export type SupportedFramework = 'react' | 'vue' | 'svelte' | 'lit';

export function correspondingDeps(framework: SupportedFramework) {
  switch (framework) {
    case 'react':
      return REACT_DEPS;
    case 'vue':
      return VUE_DEPS;
    case 'svelte':
      return SVELTE_DEPS;
    case 'lit':
      return LIT_DEPS;
    default:
      return REACT_DEPS;
  }
}

export const VITE_CONFIG_FILE = 'vite.config.ts';

export const LIT_DEPS = {
  dependencies: {
    lit: '^2.0.2',
  },
  devDependencies: {
    vite: '^2.7.2',
    typescript: '^4.4.4',
  },
};

export const SVELTE_DEPS = {
  dependencies: {},
  devDependencies: {
    '@sveltejs/vite-plugin-svelte': '^1.0.0-next.30',
    '@tsconfig/svelte': '^2.0.1',
    svelte: '^3.44.0',
    'svelte-check': '^2.2.7',
    'svelte-preprocess': '^4.9.8',
    tslib: '^2.3.1',
    typescript: '^4.4.4',
    vite: '^2.7.2',
  },
};

export const REACT_DEPS = {
  dependencies: {
    react: '^17.0.2',
    'react-dom': '^17.0.2',
  },
  devDependencies: {
    '@types/react': '^17.0.33',
    '@types/react-dom': '^17.0.10',
    '@vitejs/plugin-react': '^1.0.7',
    typescript: '^4.4.4',
    vite: '^2.7.2',
  },
};

export const VUE_DEPS = {
  dependencies: {
    vue: '^3.2.25',
  },
  devDependencies: {
    '@vitejs/plugin-vue': '^2.0.0',
    typescript: '^4.4.4',
    vite: '^2.7.2',
    'vue-tsc': '^0.29.8',
  },
};

export const pluginSpecifiedTargets = (
  projectRoot: string
): ProjectConfiguration['targets'] => {
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
