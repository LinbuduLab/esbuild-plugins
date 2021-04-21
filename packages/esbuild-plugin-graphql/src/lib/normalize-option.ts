export interface ESBuildPluginGraphqlOptions {
  enabled: boolean;
}

export interface NormalizedESBuildPluginGraphqlOptions {
  enabled: boolean;
}

export function normalizePluginOptions(
  options: ESBuildPluginGraphqlOptions
): NormalizedESBuildPluginGraphqlOptions {
  return options as NormalizedESBuildPluginGraphqlOptions;
}
