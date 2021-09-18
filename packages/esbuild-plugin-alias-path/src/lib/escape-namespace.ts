export function escapeNamespace(keys: string[]) {
  return new RegExp(
    `^${keys
      .map((str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')}$`
  );
}
