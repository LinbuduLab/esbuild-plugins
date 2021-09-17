import { Tree, getProjects } from '@nrwl/devkit';

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

/**
 * Get all avaliable apps & libs
 * @param host
 * @returns
 */
export function getAvailableAppsLibs(host: Tree): {
  apps: AvaliableApp[];
  libs: AvaliableLib[];
} {
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

/**
 * Get all avaliable apps
 * @param host
 * @returns
 */
export function getAvailableApps(host: Tree): Array<AvaliableApp> {
  return getAvailableAppsLibs(host).apps;
}

/**
 * Get all avaliable libs
 * @param host
 * @returns
 */
export function getAvailableLibs(host: Tree): Array<AvaliableLib> {
  return getAvailableAppsLibs(host).libs;
}
