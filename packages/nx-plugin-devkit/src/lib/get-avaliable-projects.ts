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

export function getAvailableApps(host: Tree): Array<AvaliableApp> {
  const projects = getProjects(host);
  const apps: Array<AvaliableApp> = [];

  projects.forEach((project, appName) => {
    if (project.projectType === 'application') {
      apps.push({
        appName,
        root: project.root,
        sourceRoot: project.sourceRoot,
      });
    }
  });

  return apps;
}
