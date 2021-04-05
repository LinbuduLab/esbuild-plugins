import {
  Tree,
  formatFiles,
  installPackagesTask,
  readProjectConfiguration,
  addProjectConfiguration,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
  getProjects,
  generateFiles,
  addDependenciesToPackageJson,
  getWorkspaceLayout,
  offsetFromRoot,
  normalizePath,
  applyChangesToString,
  joinPathFragments,
  names,
  updateJson,
} from '@nrwl/devkit';
import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';

import { nxVersion } from '@nrwl/node/src/utils/versions';
import chalk from 'chalk';

// TODO: separate methods into various files

export interface AvaliableAppOrLib {
  root: string;
  sourceRoot: string;
}

export interface AvaliableApp extends AvaliableAppOrLib {
  appName: string;
}

export interface AvaliableLib extends AvaliableAppOrLib {
  libName: string;
}

export function getAvailableAppsOrLibs(
  host: Tree
): { apps: AvaliableApp[]; libs: AvaliableLib[] } {
  const projects = getProjects(host);
  const apps: AvaliableApp[] = [];
  const libs: AvaliableLib[] = [];

  projects.forEach((project, appOrLibName) => {
    if (project.projectType === 'application') {
      apps.push({
        appName: appOrLibName,
        root: project.root,
        sourceRoot: project.sourceRoot,
      });
    } else if (project.projectType === 'library') {
      libs.push({
        libName: appOrLibName,
        root: project.root,
        sourceRoot: project.sourceRoot,
      });
    }
  });

  return { apps, libs };
}

export function getAvailableLibs(host: Tree): Array<AvaliableLib> {
  const projects = getProjects(host);
  const libs: Array<AvaliableLib> = [];

  projects.forEach((project, libName) => {
    if (project.projectType === 'library') {
      libs.push({
        libName,
        root: project.root,
        sourceRoot: project.sourceRoot,
      });
    }
  });

  return libs;
}

export function generateDTONames(className: string) {
  return {
    CreateDTOClassName: `Create${className}DTO`,
    UpdateDTOClassName: `Update${className}DTO`,
    DeleteDTOClassName: `Deleete${className}DTO`,
  };
}

// check all reserved words?
export function isValidNamespace(namespace: string): boolean {
  return (
    // typeof namespace === 'string' &&
    // FIXME: isNaN("") === false
    // isNaN(Number(namespace)) &&
    namespace !== 'true' && namespace !== 'false'
  );
}

export function updateDependencies(host: Tree) {
  updateJson(host, 'package.json', (json) => {
    delete json.dependencies['@nrwl/node'];
    return json;
  });

  return addDependenciesToPackageJson(host, {}, { '@nrwl/node': nxVersion });
}

export async function initializeNodeApp(host: Tree) {
  setDefaultCollection(host, '@nrwl/node');

  const initInstallTask = updateDependencies(host);
  return async () => {
    await initInstallTask();
  };
}

export function devLog(str: string): void {
  process.env.NODE_ENV === 'development'
    ? console.log(chalk.green(str))
    : void 0;
}

export function devInfo(str: string): void {
  process.env.NODE_ENV === 'development'
    ? console.log(chalk.cyan(str))
    : void 0;
}

export function devWarn(str: string): void {
  process.env.NODE_ENV === 'development'
    ? console.log(chalk.yellow(str))
    : void 0;
}

export function devError(str: string): void {
  process.env.NODE_ENV === 'development' ? console.log(chalk.red(str)) : void 0;
}
