import {
  Tree,
  addProjectConfiguration,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
  generateFiles,
  addDependenciesToPackageJson,
  offsetFromRoot,
  joinPathFragments,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
  updateJson,
  readProjectConfiguration,
  updateProjectConfiguration,
  TargetConfiguration,
} from '@nrwl/devkit';
import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';

import { nxVersion } from '@nrwl/node/src/utils/versions';
import type { BasicNormalizedAppGenSchema } from '../shared-schema';
import {
  createNodeAppBuildConfig,
  createNodeAppServeConfig,
} from './node-app-config';
import { setDefaultProject } from '../workspace';

export function setupProxy<
  NormalizedAppSchema extends BasicNormalizedAppGenSchema
>(host: Tree, schema: NormalizedAppSchema) {
  if (!schema.frontendProject) return;

  const projectConfig = readProjectConfiguration(host, schema.frontendProject);

  if (projectConfig?.targets?.serve) {
    const pathToProxyFile = `${projectConfig.root}/proxy.conf.json`;
    projectConfig.targets.serve.options.proxyConfig = pathToProxyFile;
    const proxyFileExists = host.exists(pathToProxyFile);

    if (proxyFileExists) {
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

export function updateNodeAppDeps(host: Tree) {
  updateJson(host, 'package.json', (json) => {
    delete json.dependencies['@nrwl/node'];
    return json;
  });

  return addDependenciesToPackageJson(host, {}, { '@nrwl/node': nxVersion });
}

export async function initializeNodeApp(host: Tree) {
  setDefaultCollection(host, '@nrwl/node');

  const initInstallTask = updateNodeAppDeps(host);
  return async () => {
    await initInstallTask();
  };
}

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

  const project: ProjectConfiguration & NxJsonProjectConfiguration = {
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

export function createNodeAppFiles<
  NormalizedAppSchema extends BasicNormalizedAppGenSchema
>(
  host: Tree,
  schema: NormalizedAppSchema,
  path: string,
  substitutions: Record<string, unknown> = {}
) {
  const subs = {
    tmpl: '',
    name: schema.projectName,
    root: schema.projectRoot,
    offset: offsetFromRoot(schema.projectRoot),
    ...substitutions,
  };

  generateFiles(host, path, schema.projectRoot, subs);
}
