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

import {
  ESBuildPluginGeneratorSchema,
  NormalizedESBuildPluginGeneratorSchema,
} from './schema';
import { normalizeSchema } from './lib/normalize-schema';
import { appendExportToIndexFile } from './lib/append-export';

export default async function (
  host: Tree,
  schema: ESBuildPluginGeneratorSchema
) {
  const normalizedSchema: NormalizedESBuildPluginGeneratorSchema = normalizeSchema(
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

  // className: 'EsbuildPluginWuhu',
  // propertyName: 'esbuildPluginWuhu',
  // fileName: 'esbuild-plugin-wuhu'
  const { className, propertyName, fileName } = names(normalizedSchema.name);

  generateFiles(
    host,
    path.join(__dirname, './files/'),
    normalizedSchema.projectSourceRoot,
    {
      tmpl: '',
      offset: offsetFromRoot(normalizedSchema.projectRoot),
      pluginName: className.replace('Esbuild', 'ESBuild'),
      lowerCasePluginName: fileName.replace('esbuild-plugin-', 'esbuild:'),
      pluginFuncName: propertyName,
      PluginFileName: fileName,
      packageName: fileName,
    }
  );

  const pluginSourceIndex = joinPathFragments(
    normalizedSchema.projectSourceRoot,
    './index.ts'
  );

  const updatedIndexFileContent = appendExportToIndexFile(
    pluginSourceIndex,
    '',
    fileName
  );

  host.write(pluginSourceIndex, updatedIndexFileContent);

  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
