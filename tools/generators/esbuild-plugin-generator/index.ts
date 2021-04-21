#!/usr/bin/env node

import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { getPackageManagerCommand } from '@nrwl/tao/src/shared/package-manager';

import { execSync } from 'child_process';
import spawn from 'cross-spawn';
import { libraryGenerator } from '@nrwl/workspace/generators';
import { generatePackageJson } from '@nrwl/node/src/utils/generate-package-json';

export default async function (host: Tree, schema: any) {
  // create generators
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
