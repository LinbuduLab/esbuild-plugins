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
} from '@nrwl/devkit';
import path from 'path';
import { nxVersion } from '@nrwl/workspace/src/utils/versions';
import {} from '@nrwl/nx-plugin/src/schematics/plugin/lib/add-files';
import { libraryGenerator as nodeLibGenerator } from '@nrwl/node/src/generators/library/library';
import {
  ESBuildPluginGeneratorSchema,
  NormalizedESBuildPluginGeneratorSchema,
} from './schema';
import { normalizeSchema } from './lib/normalize-schema';
import { appendExportToIndexFile } from './lib/append-export';
// ESBuild plugin generator
// spawn command nx g @nrwl/nx-plugin:executor  my-executor --project=my-plugin
// invoke function
export default async function (
  host: Tree,
  schema: ESBuildPluginGeneratorSchema
) {
  const normalizedSchema: NormalizedESBuildPluginGeneratorSchema = normalizeSchema(
    host,
    schema
  );

  // steps：
  // 创建publishable @nrwl/node:lib
  // 添加依赖
  // 添加executor & generator
  // 更新executor.json generators.json配置
  // 更新workspace配置

  // create generators

  nodeLibGenerator(host, {
    ...normalizedSchema,
    publishable: true,
    unitTestRunner: 'jest',
    testEnvironment: 'node',
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

  //  className: 'EsbuildPluginWuhu',
  //   propertyName: 'esbuildPluginWuhu',
  //   fileName: 'esbuild-plugin-wuhu'
  const { className, propertyName, fileName } = names(normalizedSchema.name);

  generateFiles(
    host,
    path.join(__dirname, './files/'),
    normalizedSchema.projectSourceRoot,
    {
      tmpl: '',
      offset: offsetFromRoot(normalizedSchema.projectRoot),
      pluginName: className.replace('Esbuild', 'ESBuild'),
      lowerCasePluginName: fileName.replace('esbuild-plugin', ''),
      pluginFuncName: propertyName,
      PluginFileName: fileName,
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
