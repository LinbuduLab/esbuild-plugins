#!/usr/bin/env node

import {
  Tree,
  names,
  formatFiles,
  installPackagesTask,
  addDependenciesToPackageJson,
  generateFiles,
  offsetFromRoot,
  joinPathFragments,
  readProjectConfiguration,
  updateProjectConfiguration,
  getWorkspaceLayout,
} from '@nrwl/devkit';
import path from 'path';
import { nxVersion } from '@nrwl/workspace/src/utils/versions';
import { libraryGenerator as nodeLibGenerator } from '@nrwl/node/src/generators/library/library';
import type {
  PluginGeneratorSchema,
  NormalizedPluginGeneratorSchema,
} from '../utils';

import { normalizeSchema } from './lib/normalize-schema';
import { appendExportToIndexFile } from './lib/append-export';

export interface SnowpackPluginGeneratorSchema extends PluginGeneratorSchema {
  name: string;
}

export interface NormalizedSnowpackPluginGeneratorSchema
  extends NormalizedPluginGeneratorSchema {}

export default async function (
  host: Tree,
  schema: SnowpackPluginGeneratorSchema
) {
  const normalizedSchema: NormalizedSnowpackPluginGeneratorSchema = normalizeSchema(
    host,
    schema
  );

  nodeLibGenerator(host, {
    ...normalizedSchema,
    publishable: true,
    unitTestRunner: 'jest',
    testEnvironment: 'node',
  });

  const projectConfiguration = readProjectConfiguration(
    host,
    normalizedSchema.projectName
  );

  const { appsDir, libsDir } = getWorkspaceLayout(host);

  const { targets } = projectConfiguration;

  const extendedTargets = {
    ...targets,
    build: {
      executor: '@nrwl/node:package',
      outputs: ['{options.outputPath}'],
      options: {
        outputPath: `dist/packages/${normalizedSchema.projectName}`,
        tsConfig: `${libsDir}/${normalizedSchema.projectName}/tsconfig.lib.json`,
        packageJson: `${libsDir}/${normalizedSchema.projectName}/package.json`,
        main: `${libsDir}/${normalizedSchema.projectName}/src/index.ts`,
        assets: [`${libsDir}/${normalizedSchema.projectName}/*.md`],
      },
    },
  };
  updateProjectConfiguration(host, normalizedSchema.projectName, {
    ...projectConfiguration,
    targets: extendedTargets,
  });

  addDependenciesToPackageJson(
    host,
    {},
    {
      '@nrwl/devkit': nxVersion,
      '@nrwl/node': nxVersion,
      tslib: '^2.0.0',
    }
  );

  const pluginSuffix = normalizedSchema.name.replace('snowpack-plugin-', '');

  // assets - Assets
  // markdown-import MarkdownImport
  const capitalizedSuffix = names(pluginSuffix).className;

  generateFiles(
    host,
    path.join(__dirname, './files/'),
    normalizedSchema.projectSourceRoot,
    {
      tmpl: '',
      offset: offsetFromRoot(normalizedSchema.projectRoot),
      pluginFileName: normalizedSchema.name,
      pluginName: capitalizedSuffix,
    }
  );

  const pluginSourceIndex = joinPathFragments(
    normalizedSchema.projectSourceRoot,
    './index.ts'
  );

  const updatedIndexFileContent = appendExportToIndexFile(
    pluginSourceIndex,
    '',
    normalizedSchema.name
  );

  const tsconfigPath = joinPathFragments(
    normalizedSchema.projectRoot,
    './tsconfig.json'
  );

  const tsconfig = JSON.parse(host.read(tsconfigPath).toString());

  const updatedTsConfig = {
    extends: tsconfig.extends,
    compilerOptions: {
      target: 'es2016',
      sourceMap: false,
      lib: [],
      importHelpers: false,
    },
    files: [],
    include: [],
    references: [...tsconfig.references],
  };

  host.write(tsconfigPath, JSON.stringify(updatedTsConfig));
  host.write(pluginSourceIndex, updatedIndexFileContent);

  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
