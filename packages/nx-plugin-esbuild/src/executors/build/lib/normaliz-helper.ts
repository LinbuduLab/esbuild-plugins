import path from 'path';
import {
  Insert,
  FormattedInsert,
  FileReplacement,
  InsertType,
  InsertFileType,
} from './types';

export function normalizeInserts(
  inserts: Array<Insert | string>
): FormattedInsert {
  const formattedInserts: FormattedInsert = { footer: {}, banner: {} };

  inserts
    .filter(
      (insert) =>
        typeof insert === 'string' || typeof insert.content === 'string'
    )
    .forEach((insert) => {
      const content = typeof insert === 'string' ? insert : insert.content;

      typeof insert === 'string'
        ? (formattedInserts[InsertType.BANNER][InsertFileType.JS] = content)
        : (formattedInserts[
            insert.banner ? InsertType.BANNER : InsertType.FOOTER
          ][insert.applyToJSFile ? InsertFileType.JS : InsertFileType.CSS] =
            content);
    });

  return formattedInserts;
}

/**
 * Ensure injects's suffix, join with source root path.
 * @param injects
 * @param sourceRoot
 * @returns
 */
export function normalizeInject(
  injects: string[],
  sourceRoot: string
): string[] {
  return injects.map((injectPath) => {
    if (!injectPath.endsWith('.js') && !injectPath.endsWith('.ts')) {
      throw new Error(`${injectPath} should ends with .js/.ts!`);
    }

    const normalizedInjectPath = path.join(sourceRoot, injectPath);

    return normalizedInjectPath;
  });
}

/**
 * Update replacement.replace/with to be absolute path
 * @param projectRoot
 * @param fileReplacements
 * @returns
 */
export function normalizeFileReplacements(
  projectRoot: string,
  fileReplacements: FileReplacement[]
): FileReplacement[] {
  return fileReplacements
    ? fileReplacements.map((fileReplacement) => ({
        replace: path.resolve(projectRoot, fileReplacement.replace),
        with: path.resolve(projectRoot, fileReplacement.with),
      }))
    : [];
}
