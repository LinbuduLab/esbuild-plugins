import path from 'path';
import merge from 'lodash/merge';
import { Tree } from '@nrwl/devkit';

import { ObjectType } from '../tool-type';
import { writeJsonFile } from '../utils/file-utils';
import { updateJson } from '../utils/json';

export interface BasePackageJSONFields {
  name: string;
  version: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
}

/**
 * Create a new package.json file for project
 * @param content
 * @param projectRoot
 */
export const createPackageJSON = (
  content: Partial<BasePackageJSONFields>,
  projectRoot: string
) => {
  writeJsonFile(path.resolve(projectRoot, 'package.json'), content, {
    appendNewLine: true,
  });
};

/**
 * Update exist package.json
 * @param tree
 * @param content
 */
export const updatePackageJson = (
  tree: Tree,
  content: Partial<
    Pick<
      BasePackageJSONFields,
      'dependencies' | 'devDependencies' | 'peerDependencies' | 'scripts'
    >
  >
) => {
  updateJson<ObjectType<keyof BasePackageJSONFields>>(
    tree,
    'package.json',
    (val: BasePackageJSONFields) => {
      merge(val.scripts, content.scripts);

      merge(val.dependencies, content.dependencies);
      merge(val.devDependencies, content.devDependencies);
      merge(val.peerDependencies, content.peerDependencies);

      return val;
    }
  );
};
