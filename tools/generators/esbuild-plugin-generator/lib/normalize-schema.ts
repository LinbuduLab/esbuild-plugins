import {
  Tree,
  names,
  getWorkspaceLayout,
  joinPathFragments,
} from '@nrwl/devkit';
import path from 'path';
import type {
  PluginGeneratorSchema,
  NormalizedPluginGeneratorSchema,
} from '../../utils';

export function normalizeSchema(
  host: Tree,
  schema: PluginGeneratorSchema
): NormalizedPluginGeneratorSchema {
  const { libsDir, npmScope } = getWorkspaceLayout(host);

  const pluginName = schema.name.startsWith('esbuild-plugin-')
    ? schema.name
    : `esbuild-plugin-${schema.name}`;

  // esbuild-plugin-wuhu
  const name = names(pluginName).fileName;

  // esbuild-plugin-wuhu
  const projectDirectory = schema.directory
    ? `${names(schema.directory).fileName}/${name}`
    : name;

  // esbuild-plugin-wuhu
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');

  // packages/esbuild-plugin-wuhu
  const projectRoot = joinPathFragments(`${libsDir}/${projectDirectory}`);

  // packages/esbuild-plugin-wuhu/src
  const projectSourceRoot = path.join(projectRoot, './src');

  const parsedTags = schema.tags
    ? schema.tags.split(',').map((s) => s.trim())
    : [];

  const npmPackageName = `@${npmScope}/${name}`;

  // const importPath = schema.importPath ?? npmPackageName;
  const importPath = name;

  return {
    ...schema,
    name,
    projectName,
    projectRoot,
    projectDirectory,
    npmScope,
    npmPackageName,
    projectSourceRoot,
    parsedTags,
    importPath,
  };
}
