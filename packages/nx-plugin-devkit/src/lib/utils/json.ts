import { parse, printParseErrorCode, stripComments } from 'jsonc-parser';
import type { ParseError } from 'jsonc-parser';
import prettier from 'prettier';
import sortPackageJson from 'sort-package-json';
import type { Tree } from '@nrwl/tao/src/shared/tree';
import { ObjectType } from '../tool-type';

export { stripComments as stripJsonComments };

export interface JsonParseOptions {
  /**
   * Expect JSON with javascript-style
   * @default false
   */
  expectComments?: boolean;
  /**
   * Disallow javascript-style
   * @default false
   */
  disallowComments?: boolean;
}

export interface JsonSerializeOptions {
  /**
   * the whitespaces to add as intentation to make the output more readable.
   * @default 2
   */
  spaces?: number;
}

/**
 * Parses the given JSON string and returns the object the JSON content represents.
 * By default javascript-style comments are allowed.
 *
 * @param input JSON content as string
 * @param options JSON parse options
 * @returns Object the JSON content represents
 */
export function parseJson<T extends ObjectType = ObjectType>(
  input: string,
  options?: JsonParseOptions
): T {
  try {
    if (
      options?.disallowComments === true ||
      options?.expectComments !== true
    ) {
      return JSON.parse(input);
    }
  } catch (error) {
    if (options?.disallowComments === true) {
      throw error;
    }
  }

  const errors: ParseError[] = [];
  const result: T = parse(input, errors);

  if (errors.length > 0) {
    const { error, offset } = errors[0];
    throw new Error(
      `${printParseErrorCode(error)} in JSON at position ${offset}`
    );
  }

  return result;
}

/**
 * Serializes the given data to a JSON string.
 * By default the JSON string is formatted with a 2 space intendation to be easy readable.
 *
 * @param input Object which should be serialized to JSON
 * @param options JSON serialize options
 * @returns the formatted JSON representation of the object
 */
export function serializeJson<T extends ObjectType = ObjectType>(
  input: T,
  options?: JsonSerializeOptions
): string {
  return JSON.stringify(input, null, options?.spaces ?? 2) + '\n';
}

/**
 * Reads a json file, removes all comments and parses JSON.
 *
 * @param tree - file system tree
 * @param path - file path
 * @param options - Optional JSON Parse Options
 */
export function readJson<T extends ObjectType = ObjectType>(
  tree: Tree,
  path: string,
  options?: JsonParseOptions
): T {
  if (!tree.exists(path)) {
    throw new Error(`Cannot find ${path}`);
  }
  try {
    return parseJson(tree.read(path, 'utf-8'), options);
  } catch (e) {
    throw new Error(`Cannot parse ${path}: ${e.message}`);
  }
}

/**
 * Writes a JSON value to the file system tree

 * @param tree File system tree
 * @param path Path of JSON file in the Tree
 * @param value Serializable value to write
 * @param options Optional JSON Serialize Options
 */
export function writeJson<T extends ObjectType = ObjectType>(
  tree: Tree,
  path: string,
  value: T,
  options?: JsonSerializeOptions
): void {
  tree.write(
    path,
    prettier.format(sortPackageJson(serializeJson(value, options)), {
      parser: 'json-stringify',
    })
  );
}

/**
 * Updates a JSON value to the file system tree
 *
 * @param tree File system tree
 * @param path Path of JSON file in the Tree
 * @param updater Function that maps the current value of a JSON document to a new value to be written to the document
 * @param options Optional JSON Parse and Serialize Options
 */
export function updateJson<
  T extends ObjectType = ObjectType,
  U extends ObjectType = T
>(
  tree: Tree,
  path: string,
  updater: (value: T) => U,
  options?: JsonParseOptions & JsonSerializeOptions
): void {
  const updatedValue = updater(readJson(tree, path, options));
  writeJson(tree, path, updatedValue, options);
}
