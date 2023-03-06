import chalk from 'chalk';
import type { MaybeArray, AssetPair } from './typings';

export function ensureArray<T>(item: MaybeArray<T>): Array<T> {
  return Array.isArray(item) ? item : [item];
}

export function verboseLog(msg: string, verbose: boolean, lineBefore = false) {
  if (!verbose) {
    return;
  }
  console.log(chalk.blue(lineBefore ? '\ni' : 'i'), msg);
}

export function formatAssets(assets: MaybeArray<AssetPair>) {
  return ensureArray(assets)
    .filter((asset) => asset.from && asset.to)
    .map(({ from, to, watch }) => ({
      from: ensureArray(from),
      to: ensureArray(to),
      watch: watch ?? false,
    }));
}

export const PLUGIN_EXECUTED_FLAG = 'esbuild_copy_executed';
