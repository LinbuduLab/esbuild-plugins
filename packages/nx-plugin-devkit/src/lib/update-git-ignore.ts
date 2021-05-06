import { Tree } from '@nrwl/devkit';

// reminded by https://github.com/ZachJW34/nx-plus/blob/master/libs/docusaurus/src/schematics/app/schematic.ts
export function updateGitIgnore(host: Tree, patterns: string[]) {
  const gitIgnoreContent = '.gitignore';

  const existGitIgnoreContent = host
    .read(gitIgnoreContent)
    .toString('utf8')
    .trimRight();

  const newPatterns = patterns.filter(
    (pattern) => !existGitIgnoreContent.includes(pattern)
  );

  if (!newPatterns.length) return;

  const updatedGitIgnoreContent = `
    ${existGitIgnoreContent}

${newPatterns.join('\n').trim()}`;

  host.write(gitIgnoreContent, updatedGitIgnoreContent);
}
