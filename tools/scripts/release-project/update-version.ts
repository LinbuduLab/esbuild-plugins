import path from 'path';
import jsonfile from 'jsonfile';
import fs from 'fs-extra';
import chalk from 'chalk';
import execa from 'execa';

export const updateVersion = (
  project: string,
  version: string,
  dryRun: boolean = false
) => {
  const projectPath = path.join(process.cwd(), 'packages', project);
  const projectPkgPath = path.join(projectPath, 'package.json');
  const pkg = jsonfile.readFileSync(projectPkgPath);
  pkg.version = version;
  if (!dryRun) {
    fs.writeFileSync(projectPkgPath, JSON.stringify(pkg, null, 2) + '\n');
  } else {
    console.log(chalk.blue(`[dryRun] updated version: ${version}`));
  }
};
