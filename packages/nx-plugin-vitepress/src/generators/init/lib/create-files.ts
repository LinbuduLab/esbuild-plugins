import { joinPathFragments, generateFiles, Tree } from '@nrwl/devkit';
import path from 'path';

import { NormalizedInitSchema } from '../schema';

export function createAppFiles(host: Tree, schema: NormalizedInitSchema) {
  const {
    projectName,
    projectRoot,
    generateConfig,
    generateViteConfig,
    offsetFromRoot,
  } = schema;

  const vitepressDocRoot = joinPathFragments(projectRoot, 'docs');

  generateFiles(host, path.join(__dirname, '../files/base'), projectRoot, {
    tmpl: '',
    offset: offsetFromRoot,
    projectName,
  });

  if (generateConfig) {
    generateFiles(
      host,
      path.join(__dirname, '../files/extra/vitepress'),
      joinPathFragments(vitepressDocRoot, '.vitepress'),
      {
        tmpl: '',
      }
    );
  }

  if (generateViteConfig) {
    generateFiles(
      host,
      path.join(__dirname, '../files/extra/vite'),
      projectRoot,
      {
        tmpl: '',
      }
    );
  }
}
