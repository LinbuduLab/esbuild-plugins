#!/usr/bin/env node

import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { getPackageManagerCommand } from '@nrwl/tao/src/shared/package-manager';

import { execSync } from 'child_process';
import os from 'os';
import chalk from 'chalk';
import { CommonPluginGeneratorSchema } from './schema';

import {
  defaultNPMScope,
  workspaceRoot,
  packageManager,
  nxPluginPrefix,
} from '../utils';

export default async function (
  host: Tree,
  schema: CommonPluginGeneratorSchema
) {
  const isWin = os.platform() === 'win32';
  const pluginName = schema.name.startsWith(nxPluginPrefix)
    ? schema.name
    : `${nxPluginPrefix}-${schema.name}`;
  const importPath = schema.importPath ?? `${defaultNPMScope}/${pluginName}`;

  const command = `pnpx${
    isWin ? '.cmd' : ''
  } nx generate @nrwl/nx-plugin:plugin ${pluginName} --importPath=${importPath}`;
  console.log('Executing: ' + chalk.green(`${command}`));

  const pmc = getPackageManagerCommand(packageManager);

  execSync(`${command}`, {
    cwd: workspaceRoot,
    stdio: [0, 1, 2],
  });

  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
