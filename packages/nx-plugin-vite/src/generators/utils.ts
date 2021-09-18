import {
  joinPathFragments,
  NxJsonProjectConfiguration,
  ProjectConfiguration,
} from '@nrwl/devkit';

export const pluginSpecifiedTargets = (
  projectRoot: string
): (ProjectConfiguration & NxJsonProjectConfiguration)['targets'] => ({
  build: {
    executor: 'nx-plugin-vite:build',
    options: {
      root: projectRoot,
      outDir: 'dist',
      configFile: joinPathFragments(projectRoot, 'vite-config.ts'),
      watch: true,
      emitAtRootLevel: false,
      manifest: true,
    },
  },
  serve: {
    executor: 'nx-plugin-vite:serve',
    options: {
      root: projectRoot,
      configFile: joinPathFragments(projectRoot, 'vite.config.ts'),
    },
  },
});
