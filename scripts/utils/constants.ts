import fs from 'fs-extra';
import path from 'path';
import nx from '../../nx.json';

export const PLUGIN_DIR = path.resolve(
  __dirname,
  '../../',
  nx.workspaceLayout.libsDir
);

export const PROJECT_LIST = fs.readdirSync(PLUGIN_DIR);

export const getPluginList = () => {
  return fs.readdirSync(PLUGIN_DIR);
};

export const getPluginDirList = () => {
  return getPluginList().map((plugin) => path.resolve(PLUGIN_DIR, plugin));
};

export const getPluginDir = (plugin: string): string => {
  return path.resolve(PLUGIN_DIR, plugin);
};
