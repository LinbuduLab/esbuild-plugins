export interface Option {
  resourceRegExp?: RegExp;
  contextRegExp?: RegExp;
  // checkResource?: (resourceRegExp: RegExp, contextRegExp: RegExp) => boolean;
}

export interface NormalizedOption extends Option {
  resourceRegExp?: RegExp;
  contextRegExp?: RegExp;
  // checkResource?: (resourceRegExp: RegExp, contextRegExp: RegExp) => boolean;
}

export function normalizeOptions(option: Option[] = []): NormalizedOption[] {
  if (!option.length) {
    console.log('Ignore Plugin Skipped.');
  }

  // return option.filter(
  //   (pattern) => pattern.resourceRegExp || pattern.checkResource
  // );
  return option.filter((pattern) => pattern.resourceRegExp);
}
