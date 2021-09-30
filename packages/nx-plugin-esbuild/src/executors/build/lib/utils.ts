export const ensureArray = <T>(maybeArray: T | T[]): T[] =>
  Array.isArray(maybeArray) ? maybeArray : [maybeArray];
