import path from 'path';
import { Insert, FormattedInsert, FileReplacement } from './types';

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
        ? (formattedInserts['banner']['js'] = content)
        : (formattedInserts[insert.banner ? 'banner' : 'footer'][
            insert.applyToJSFile ? 'js' : 'css'
          ] = content);
    });

  return formattedInserts;
}

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
