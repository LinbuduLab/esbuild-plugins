import fs from 'fs-extra';
import path from 'path';

export const cwd = process.cwd();

export const allPackages = fs.readdirSync(path.resolve(cwd, 'packages'));

export const esbuildPlugins = allPackages.filter((pkg) =>
  pkg.startsWith('esbuild-plugin-')
);

export const availablePackages = allPackages.filter(
  (pkg) => pkg.startsWith('nx-plugin-') || pkg.startsWith('vite-plugin-')
);
