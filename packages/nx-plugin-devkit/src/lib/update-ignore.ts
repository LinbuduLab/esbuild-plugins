import { Tree } from '@nrwl/devkit';

// reminded by https://github.com/ZachJW34/nx-plus/blob/master/libs/docusaurus/src/schematics/app/schematic.ts
export function updateGitIgnore(host: Tree, patterns: string[]) {
  const gitIgnorePath = '.gitignore';

  const existGitIgnoreContent = host
    .read(gitIgnorePath)
    .toString('utf8')
    .trimRight();

  const newPatterns = patterns.filter(
    (pattern) => !existGitIgnoreContent.includes(pattern)
  );

  if (!newPatterns.length) return;

  const updatedGitIgnoreContent = `
    ${existGitIgnoreContent}

${newPatterns.join('\n').trim()}`;

  host.write(gitIgnorePath, updatedGitIgnoreContent);
}

export function updatePrettierIgnore(host: Tree, patterns: string[]) {
  const prettierIgnore = '.prettierignore';

  const existPrettierIgnoreContent = host
    .read(prettierIgnore)
    .toString('utf8')
    .trimRight();

  const newPatterns = patterns.filter(
    (pattern) => !existPrettierIgnoreContent.includes(pattern)
  );

  if (!newPatterns.length) return;

  const updatedGitIgnoreContent = `
    ${existPrettierIgnoreContent}

${newPatterns.join('\n').trim()}`;

  host.write(prettierIgnore, updatedGitIgnoreContent);
}
