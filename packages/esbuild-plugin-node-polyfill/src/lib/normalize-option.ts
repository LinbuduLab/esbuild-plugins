export interface ESBuildPluginNodePolyfillOptions {
  tmp?: boolean;
}

export interface NormalizedESBuildPluginNodePolyfillOptions {
  tmp?: boolean;
}

export function normalizePluginOptions(
  options: ESBuildPluginNodePolyfillOptions
): NormalizedESBuildPluginNodePolyfillOptions {
  return options as NormalizedESBuildPluginNodePolyfillOptions;
}
