import fs from 'fs-extra';
import path from 'path';

export const PACKAGE_DIR = 'packages';

export const DIST_DIR = 'dist';

export const ABSOLUTE_PACKAGE_DIR = path.resolve(
  __dirname,
  '../../',
  PACKAGE_DIR
);

export const PROJECT_LIST = fs.readdirSync(PACKAGE_DIR);

export const getPluginList = (): string[] => {
  return fs.readdirSync(PACKAGE_DIR);
};

export const getPluginDirList = () => {
  return getPluginList().map((plugin) => path.resolve(PACKAGE_DIR, plugin));
};

export const getPluginDir = (plugin: string): string => {
  return path.resolve(PACKAGE_DIR, plugin);
};
