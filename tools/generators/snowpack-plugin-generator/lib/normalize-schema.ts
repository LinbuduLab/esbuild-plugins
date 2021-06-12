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

  const pluginName = schema.name.startsWith('snowpack-plugin-')
    ? schema.name
    : `snowpack-plugin-${schema.name}`;

  // snowpack-plugin-wuhu
  const name = names(pluginName).fileName;

  // snowpack-plugin-wuhu
  const projectDirectory = schema.directory
    ? `${names(schema.directory).fileName}/${name}`
    : name;

  // snowpack-plugin-wuhu
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');

  // packages/snowpack-plugin-wuhu
  const projectRoot = joinPathFragments(`${libsDir}/${projectDirectory}`);

  // packages/snowpack-plugin-wuhu/src
  const projectSourceRoot = path.join(projectRoot, './src');

  const parsedTags = schema.tags
    ? schema.tags.split(',').map((s) => s.trim())
    : [];

  const npmPackageName = name;

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
