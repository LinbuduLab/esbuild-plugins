import { Tree, names, getWorkspaceLayout, offsetFromRoot } from '@nrwl/devkit';
import { getAvailableAppsOrLibs } from 'nx-plugin-devkit';
import {
  ESBuildInitGeneratorSchema,
  NormalizedESBuildInitGeneratorSchema,
} from '../schema';

export function normalizeSchema(
  host: Tree,
  schema: ESBuildInitGeneratorSchema
): NormalizedESBuildInitGeneratorSchema {
  const { apps } = getAvailableAppsOrLibs(host);

  const appNames = apps.map((app) => app.appName);

  if (appNames.includes(schema.name)) {
    throw new Error(`App  ${schema.name} exist already.`);
  }

  const name = names(schema.name).fileName;

  const projectDirectory = schema.directory
    ? `${names(schema.directory).fileName}/${name}`
    : name;

  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');

  // apps/app1
  const projectRoot = `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`;

  const parsedTags = schema.tags
    ? schema.tags.split(',').map((s) => s.trim())
    : [];

  const offset = offsetFromRoot(projectRoot);

  const main = `${projectRoot}/src/main.ts`;
  const outputPath = `dist/apps/${projectName}`;
  const tsConfigPath = `${projectRoot}/tsconfig.app.json`;
  const assets = [`${projectRoot}/src/assets`];

  return {
    ...schema,
    projectName,
    projectDirectory,
    projectRoot,
    parsedTags,
    offsetFromRoot: offset,
    main,
    outputPath,
    tsConfigPath,
    assets,
    watch: schema?.watch ?? false,
    useTSCPluginForDecorator: schema?.useTSCPluginForDecorator ?? true,
  };
}
