import {
  SnowpackConfig,
  SnowpackPlugin,
  SnowpackPluginFactory,
  logger,
} from 'snowpack';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import globby, { GlobbyOptions } from 'globby';

type MaybeArray<T> = T | T[];

export interface AssetPair {
  // file/folder/globs
  from: MaybeArray<string>;
  to: MaybeArray<string>;
}

export interface AssetsPluginOptions {
  assets: MaybeArray<AssetPair>;
  globbyOptions: GlobbyOptions;
}

function copyHandler(outDir: string, from: string, to: string) {
  const { base: fromPathBase } = path.parse(from);
  fs.ensureDirSync(path.resolve(outDir, to));
  fs.copyFileSync(path.resolve(from), path.resolve(outDir, to, fromPathBase));
}

function toArray<T>(item: MaybeArray<T>): Array<T> {
  return Array.isArray(item) ? item : [item];
}

function formatAssets(assets: MaybeArray<AssetPair>) {
  return toArray(assets)
    .filter((asset) => asset.from && asset.to)
    .map(({ from, to }) => ({
      from: toArray(from),
      to: toArray(to),
    }));
}

export type AssetsPlugin = SnowpackPluginFactory<AssetsPluginOptions>;

const snowpackPluginAssets: AssetsPlugin = (
  snowpackConfig: SnowpackConfig,
  pluginOptions: AssetsPluginOptions
): SnowpackPlugin => {
  const { assets = [], globbyOptions = {} } = pluginOptions;

  return {
    name: 'plugin:assets',
    async optimize({ buildDirectory }) {
      const formattedAssets = formatAssets(assets);

      if (!formattedAssets.length) {
        logger.info('Asset Plugin Skipped.', {
          name: 'plugin:assets',
        });
        return;
      }

      for (const { from, to } of formattedAssets) {
        const pathsCopyFrom = await globby(from, {
          expandDirectories: false,
          onlyFiles: true,
          ...globbyOptions,
        });

        logger.info(
          `Files will be copied: \n${pathsCopyFrom
            .map((file) => chalk.cyan(`- ${file}`))
            .join('\n')}`,
          {
            name: 'plugin:assets',
          }
        );

        for (const fromPath of pathsCopyFrom) {
          to.forEach((toPath) => copyHandler(buildDirectory, fromPath, toPath));
        }
      }
    },
  };
};
export default snowpackPluginAssets;
