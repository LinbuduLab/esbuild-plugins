export interface Alias {
  from: string | RegExp;
  to: string;
}
export interface ESBuildPluginAliasPathOptions {
  // alias
  // {"a":"b"} or [{from:"", to:""}]
  aliases?: Record<string, string> | Alias[];
  // tsconfig-paths
  paths?: Record<string, string>;
  // nx fileReplacements
}

export type NormalizedESBuildPluginAliasPathOptions = Required<ESBuildPluginAliasPathOptions>;

export function normalizeOption(
  options: ESBuildPluginAliasPathOptions = {}
): NormalizedESBuildPluginAliasPathOptions {
  const normalizedOptions: NormalizedESBuildPluginAliasPathOptions = {
    aliases: options.aliases ?? {},
    paths: options.paths || {},
  };

  return normalizedOptions;
}
