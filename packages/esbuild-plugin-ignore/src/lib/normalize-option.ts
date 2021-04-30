export interface ESBuildPluginIgnoreOption {
  resourceRegExp?: RegExp;
  contextRegExp?: RegExp;
  // checkResource?: (resourceRegExp: RegExp, contextRegExp: RegExp) => boolean;
}

export interface NormalizedOption extends ESBuildPluginIgnoreOption {
  resourceRegExp?: RegExp;
  contextRegExp?: RegExp;
  // checkResource?: (resourceRegExp: RegExp, contextRegExp: RegExp) => boolean;
}

export function normalizeOptions(
  ignoreOptions: ESBuildPluginIgnoreOption[] = []
): NormalizedOption[] {
  if (!ignoreOptions.length) {
    console.log('Ignore Plugin Skipped By Empty Ignore Options.');
  }

  // return option.filter(
  //   (pattern) => pattern.resourceRegExp || pattern.checkResource
  // );
  return ignoreOptions.filter((pattern) => pattern.resourceRegExp);
}
