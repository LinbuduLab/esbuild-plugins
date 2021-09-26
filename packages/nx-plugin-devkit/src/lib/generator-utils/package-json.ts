import sortPackageJson from 'sort-package-json';
import { readJsonFile, writeJsonFile, updateJson, Tree } from '@nrwl/devkit';
import {} from '@nrwl/workspace';
import path from 'path';
import fs from 'fs-extra';
import merge from 'lodash/merge';

export interface BasePackageJSONFields {
  name: string;
  version: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export const createPackageJSON = (
  content: Partial<BasePackageJSONFields>,
  projectRoot: string
) => {
  writeJsonFile(path.resolve(projectRoot, 'package.json'), content, {
    appendNewLine: true,
  });
};

export const updatePackageJson = (
  tree: Tree,
  content: Partial<
    Pick<BasePackageJSONFields, 'dependencies' | 'devDependencies' | 'scripts'>
  >
) => {
  updateJson(tree, 'package.json', (val: BasePackageJSONFields) => {
    merge(val.dependencies, content.dependencies);
    merge(val.devDependencies, content.devDependencies);
    merge(val.scripts, content.scripts);
    return val;
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
