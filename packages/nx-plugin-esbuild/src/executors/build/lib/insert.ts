import { Insert, FormattedInsert } from './types';

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
