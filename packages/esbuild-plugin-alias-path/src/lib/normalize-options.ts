import path from 'path';

export interface Alias {
  from: string | RegExp;
  to: string;
}

export interface ESBuildPluginAliasPathOptions {
  // alias default as {}
  // {"a":"b"} or [{from:"a", to:"b"}]
  alias?: Record<string, string>;
  resolveModule?: boolean;
  // tsconfig.json paths

  baseUrl?: string;
  paths?: Record<string, string[]>;

  // tsconfig.json baseUrl
  // path of tsconfig.json
  tsconfigPath?: string;
}

export interface NormalizedESBuildPluginAliasPathOptions {
  alias: Record<string, string>;
  resolveModule: boolean;
  baseUrl: string | undefined;
  paths: Record<string, string[]>;
  tsconfigPath: string | undefined;
}

export function normalizeOption(
  options: ESBuildPluginAliasPathOptions = {}
): NormalizedESBuildPluginAliasPathOptions {
  const alias = options?.alias ?? {};
  const paths = options?.paths ?? {};

  // path which is not absolute and not start with ./ or ../ will be regarded as module, and use require.resolve(module) to resolve paths
  // this feature is to support nx json configuration
  const resolveModule = options?.resolveModule ?? true;

  const normalizedAlias: Record<string, string> = {};

  for (const [from, to] of Object.entries(alias)) {
    if (
      !path.isAbsolute(to) &&
      !to.startsWith('.') &&
      !to.startsWith('..') &&
      resolveModule
    ) {
      normalizedAlias[from] = require.resolve(to);
    } else {
      normalizedAlias[from] = to;
    }
  }

  const normalizedPaths = Object.keys(paths).length ? paths : {};

  return {
    alias: normalizedAlias,
    paths: normalizedPaths,
    resolveModule,
    baseUrl: options?.baseUrl,
    tsconfigPath: options?.tsconfigPath,
  };
}
