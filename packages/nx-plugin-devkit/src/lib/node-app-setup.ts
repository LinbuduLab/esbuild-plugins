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
} from '@nrwl/devkit';
import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';

import { nxVersion } from '@nrwl/node/src/utils/versions';
import type { BasicNormalizedAppGenSchema } from './shared-schema';
import {
  createNodeAppBuildConfig,
  createNodeAppServeConfig,
} from './node-app-config';

export function setupProxy<T extends BasicNormalizedAppGenSchema>(
  host: Tree,
  schema: T
) {
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

export function createNodeAppProject<T extends BasicNormalizedAppGenSchema>(
  host: Tree,
  schema: T,
  projectBuildConfiguration?: ProjectConfiguration & NxJsonProjectConfiguration
) {
  const project: ProjectConfiguration &
    NxJsonProjectConfiguration = projectBuildConfiguration ?? {
    root: schema.projectRoot,
    sourceRoot: joinPathFragments(schema.projectRoot, 'src'),
    projectType: 'application',
    targets: {},
    tags: schema.parsedTags,
  };

  project.targets.build = createNodeAppBuildConfig(project, schema);
  project.targets.serve = createNodeAppServeConfig(schema);

  addProjectConfiguration(host, schema.projectName, project);

  const workspace = readWorkspaceConfiguration(host);

  if (!workspace.defaultProject) {
    workspace.defaultProject = schema.projectName;
    updateWorkspaceConfiguration(host, workspace);
  }
}

export function createNodeAppFiles<T extends BasicNormalizedAppGenSchema>(
  host: Tree,
  schema: T,
  path: string,
  substitutions?: Record<string, unknown>
) {
  generateFiles(
    host,
    path,
    schema.projectRoot,
    substitutions ?? {
      tmpl: '',
      name: schema.projectName,
      root: schema.projectRoot,
      offset: offsetFromRoot(schema.projectRoot),
    }
  );
}
