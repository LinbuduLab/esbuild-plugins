import fs from 'fs-extra';
import path from 'path';
import cc from 'conventional-changelog';
import prettier from 'prettier';

export const changelog = (project: string) => {
  const projectPath = path.join(process.cwd(), 'packages', project);
  const changelogPath = path.join(projectPath, 'CHANGELOG.md');
  cc({
    preset: 'angular',
    pkg: {
      path: path.join(projectPath, 'package.json'),
    },
  }).pipe(fs.createWriteStream(changelogPath));

  fs.writeFileSync(
    changelogPath,
    prettier.format(fs.readFileSync(changelogPath, 'utf8'), {
      parser: 'markdown',
    })
  );
};
