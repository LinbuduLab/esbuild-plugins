import fs from 'fs-extra';
import path from 'path';

export const cwd = process.cwd();

export const allPackages = fs.readdirSync(path.resolve(cwd, 'packages'));

export const esbuildPlugins = allPackages.filter((pkg) =>
  pkg.startsWith('esbuild-plugin-')
);

export const vitePlugins = allPackages.filter((pkg) =>
  pkg.startsWith('vite-plugin-')
);

export const umiPlugins = allPackages.filter((pkg) =>
  pkg.startsWith('umi-plugin-')
);

export const parcelPlugins = allPackages.filter((pkg) =>
  pkg.startsWith('parcel-plugin-')
);

export const rollupPlugins = allPackages.filter((pkg) =>
  pkg.startsWith('rollup-plugin-')
);

export const availablePackages = allPackages;
// .filter(
//   (pkg) => pkg.startsWith('nx-plugin-') || pkg.startsWith('vite-plugin-')
// );
