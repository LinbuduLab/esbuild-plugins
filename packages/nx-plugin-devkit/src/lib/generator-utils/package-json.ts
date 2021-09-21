import sortPackageJson from 'sort-package-json';
import { readJsonFile, writeJsonFile } from '@nrwl/devkit';
import {} from '@nrwl/workspace';
import path from 'path';
import fs from 'fs-extra';

export interface BasePackageJSONFielss {
  name: string;
  version: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export const createPackageJSON = (
  content: Partial<BasePackageJSONFielss>,
  projectRoot: string
) => {
  writeJsonFile(path.resolve(projectRoot, 'package.json'), content, {
    appendNewLine: true,
  });
};

export const addProjectDepsToPackageJSON = (
  projectRoot: string,
  deps: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  }
) => {
  const originPkg = readJsonFile(path.resolve(projectRoot, 'package.json'));

  for (const depType of [
    'dependencies',
    'devDependencies',
    'peerDependencies',
  ]) {
    originPkg[depType] = {
      ...originPkg[depType],
      ...deps[depType],
    };
  }

  fs.writeFileSync(
    path.resolve(projectRoot, 'package.json'),
    sortPackageJson(JSON.stringify(originPkg, null, 2))
  );
};
