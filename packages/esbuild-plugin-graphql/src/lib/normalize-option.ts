export interface ESBuildPluginGraphqlOptions {
  tmp?: boolean;
}

export interface NormalizedESBuildPluginGraphqlOptions {
  tmp?: boolean;
}

export function normalizePluginOptions(
  options: ESBuildPluginGraphqlOptions
): NormalizedESBuildPluginGraphqlOptions {
  return options as NormalizedESBuildPluginGraphqlOptions;
}
