import { Tree } from '@nrwl/devkit';

// reminded by https://github.com/ZachJW34/nx-plus/blob/master/libs/docusaurus/src/schematics/app/schematic.ts

/**
 * Update git ignore
 * @param host
 * @param patterns
 * @returns
 */
export function updateGitIgnore(host: Tree, patterns: string[]) {
  const gitIgnorePath = '.gitignore';

  const existGitIgnoreContent = host
    .read(gitIgnorePath)
    .toString('utf8')
    .trimRight();

  const patternsToAdd = patterns.filter(
    (pattern) => !existGitIgnoreContent.includes(pattern)
  );

  if (!patternsToAdd.length) return;

  const updatedGitIgnoreContent = `
    ${existGitIgnoreContent}

${patternsToAdd.join('\n').trim()}`;

  host.write(gitIgnorePath, updatedGitIgnoreContent);
}

/**
 * Update prettier ignore
 * @param host
 * @param patterns
 * @returns
 */
export function updatePrettierIgnore(host: Tree, patterns: string[]) {
  const prettierIgnore = '.prettierignore';

  const existPrettierIgnoreContent = host
    .read(prettierIgnore)
    .toString('utf8')
    .trimRight();

  const patternsToAdd = patterns.filter(
    (pattern) => !existPrettierIgnoreContent.includes(pattern)
  );

  if (!patternsToAdd.length) return;

  const updatedGitIgnoreContent = `
    ${existPrettierIgnoreContent}

${patternsToAdd.join('\n').trim()}`;

  host.write(prettierIgnore, updatedGitIgnoreContent);
}
