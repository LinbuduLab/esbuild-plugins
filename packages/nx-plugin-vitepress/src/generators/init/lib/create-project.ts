import {
  joinPathFragments,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
} from '@nrwl/devkit';

import { NormalizedInitSchema } from '../schema';

export function createProjectConfiguration(
  schema: NormalizedInitSchema
): ProjectConfiguration & NxJsonProjectConfiguration {
  const {
    projectRoot,
    projectSourceRoot,
    parsedTags,
    overrideTargets,
    generateViteConfig,
  } = schema;

  const buildTargetName = overrideTargets ? 'build' : 'vite-build';
  const serveTargetName = overrideTargets ? 'serve' : 'vite-serve';
  const devTargetName = overrideTargets ? 'dev' : 'vite-dev';
  const infoTargetName = overrideTargets ? 'info' : 'vite-info';

  const vitepressDocRoot = joinPathFragments(projectRoot, 'docs');
  const vitepressOutput = joinPathFragments(
    vitepressDocRoot,
    '.vitepress',
    'dist'
  );
  const viteConfigPath = joinPathFragments(projectRoot, 'vite.config.ts');

  const project: ProjectConfiguration & NxJsonProjectConfiguration = {
    root: projectRoot,
    sourceRoot: projectSourceRoot,
    projectType: 'application',
    targets: {
      [buildTargetName]: {
        executor: 'nx-plugin-vitepress:build',
        outputs: [vitepressOutput],
        options: {
          root: vitepressDocRoot,
          outDir: 'dist',
          assetsDir: 'assets',
          write: true,
          manifest: false,
          brotliSize: true,
          watch: false,
        },
      },
      [serveTargetName]: {
        executor: 'nx-plugin-vitepress:serve',
        options: {
          root: vitepressDocRoot,
          port: 6789,
        },
      },
      [devTargetName]: {
        executor: 'nx-plugin-vitepress:dev',
        options: {
          root: vitepressDocRoot,
          port: 6789,
        },
      },
      [infoTargetName]: {
        executor: 'nx-plugin-vitepress:info',
        options: {
          root: projectRoot,
          buildTarget: buildTargetName,
          serveTarget: serveTargetName,
          devTarget: devTargetName,
        },
      },
    },
    tags: parsedTags,
  };

  if (generateViteConfig) {
    project.targets[buildTargetName].options['viteConfigPath'] = viteConfigPath;
    project.targets[devTargetName].options['viteConfigPath'] = viteConfigPath;
  }

  return project;
}
