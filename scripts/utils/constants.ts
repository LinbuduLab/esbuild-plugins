import fs from 'fs-extra';
import path from 'path';
import { buildWorkspaceConfigurationFromGlobs } from '@nrwl/tao/src/shared/workspace';

export const PLUGIN_DIR = 'packages';

export const ABSOLUTE_PLUGIN_DIR = path.resolve(
  __dirname,
  '../../',
  PLUGIN_DIR
);

export const PROJECT_LIST = fs.readdirSync(PLUGIN_DIR);

export const getPluginList = (): string[] => {
  return fs.readdirSync(PLUGIN_DIR);
};

export const getPluginDirList = () => {
  return getPluginList().map((plugin) => path.resolve(PLUGIN_DIR, plugin));
};

export const getPluginDir = (plugin: string): string => {
  return path.resolve(PLUGIN_DIR, plugin);
};
