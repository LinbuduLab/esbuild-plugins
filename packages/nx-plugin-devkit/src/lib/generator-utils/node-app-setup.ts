import {
  ProjectConfiguration,
  TargetConfiguration,
  Tree,
  addDependenciesToPackageJson,
  addProjectConfiguration,
  generateFiles,
  joinPathFragments,
  offsetFromRoot,
  readProjectConfiguration,
  updateJson,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import {
  createNodeAppBuildConfig,
  createNodeAppServeConfig,
} from './node-app-config';

import type { BasicNormalizedAppGenSchema } from '../schema/shared-schema';
import { nxVersion } from '@nrwl/node/src/utils/versions';
import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';
import { setDefaultProject } from '../workspace-utils/set-default-project';

// import { setDefaultProject } from '../workspace-utils/check-project';

/**
 * For node applications, when generator invokes with `--frontendProject` flag,
 * we setup proxy config for specified frontend project,
 * which connects to generated node applications.
 * @param host
 * @param schema
 * @returns
 */
export function setupProxy<
  NormalizedAppSchema extends BasicNormalizedAppGenSchema
>(host: Tree, schema: NormalizedAppSchema) {
  if (!schema.frontendProject) return;

  const projectConfig = readProjectConfiguration(host, schema.frontendProject);

  // TODO: Should throw on frontendProject not found?

  if (projectConfig?.targets?.serve) {
    const pathToProxyFile = `${projectConfig.root}/proxy.conf.json`;
    projectConfig.targets.serve.options.proxyConfig = pathToProxyFile;
    const proxyFileExists = host.exists(pathToProxyFile);

    if (proxyFileExists) {
      // If proxy file exist, append new configuration
      const existProxyFileContent = host.read(pathToProxyFile).toString();
      const updatedProxyFileContent = {
        ...JSON.parse(existProxyFileContent),
        [`/${schema.projectName}-api`]: {
          target: 'http://localhost:3333',
          secure: false,
        },
      };
      host.write(
        pathToProxyFile,
        JSON.stringify(updatedProxyFileContent, null, 2)
      );
    } else {
      // Else, create new proxy file
      host.write(
        pathToProxyFile,
        JSON.stringify(
          {
            '/api': {
              target: 'http://localhost:3333',
              secure: false,
            },
          },
          null,
          2
        )
      );
    }

    updateProjectConfiguration(host, schema.frontendProject, projectConfig);
  }
}

/**
 * Update dependencies for node applications.
 * Move @nrwl/node to devDependencies
 * @param host
 * @returns
 */
export function updateNodeAppDeps(host: Tree) {
  updateJson(host, 'package.json', (json) => {
    '@nrwl/node' in json.dependencies && delete json.dependencies['@nrwl/node'];
    return json;
  });

  return addDependenciesToPackageJson(host, {}, { '@nrwl/node': nxVersion });
}

/**
 * Initialize node applications, should be invoked after `createNodeAppProject`
 * @param host
 * @returns
 */
export async function initializeNodeApp(host: Tree) {
  setDefaultCollection(host, '@nrwl/node');

  const initInstallTask = updateNodeAppDeps(host);
  return async () => {
    await initInstallTask();
  };
}

/**
 * Create brand new node project and configurations
 * @param host
 * @param schema
 * @param buildTarget
 * @param serveTarget
 * @param buildTargetName
 * @param serveTargetName
 */
export function createNodeAppProject<
  NormalizedAppSchema extends BasicNormalizedAppGenSchema
>(
  host: Tree,
  schema: NormalizedAppSchema,
  buildTarget?: TargetConfiguration | null,
  serveTarget?: TargetConfiguration | null,
  buildTargetName?: string | null,
  serveTargetName?: string | null
) {
  const projectBuildTargetName = buildTargetName ?? 'build';
  const projectServeTargetName = serveTargetName ?? 'serve';

  const project: ProjectConfiguration = {
    root: schema.projectRoot,
    sourceRoot: joinPathFragments(schema.projectRoot, 'src'),
    projectType: 'application',
    targets: {
      [projectBuildTargetName]: createNodeAppBuildConfig(schema, buildTarget),
      [projectServeTargetName]: createNodeAppServeConfig(
        schema,
        serveTarget,
        projectBuildTargetName
      ),
    },
    tags: schema.parsedTags,
  };

  addProjectConfiguration(host, schema.projectName, project);

  setDefaultProject(host, schema);
}

/**
 * Simple wrapper for node applications file generator
 * Using EJS as template engine under the hood.
 * @param host
 * @param schema
 * @param targetPath
 * @param substitutions
 */
export function createNodeAppFiles<
  NormalizedAppSchema extends BasicNormalizedAppGenSchema
>(
  host: Tree,
  schema: NormalizedAppSchema,
  targetPath: string,
  substitutions: Record<string, unknown> = {}
) {
  const subs = {
    tmpl: '',
    name: schema.projectName,
    root: schema.projectRoot,
    offset: offsetFromRoot(schema.projectRoot),
    ...substitutions,
  };

  generateFiles(host, targetPath, schema.projectRoot, subs);
}
