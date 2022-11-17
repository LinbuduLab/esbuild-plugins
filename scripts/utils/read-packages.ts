import fs from 'fs-extra';
import path from 'path';
import jsonfile from 'jsonfile';
import { PACKAGE_DIR } from './constants';

export type ProjectWithVersion = {
  project: string;
  version: string;
};

export const readWorkspacePackagesWithVersion = (): ProjectWithVersion[] => {
  const packageDir = path.join(process.cwd(), PACKAGE_DIR);
  const packages = fs.readdirSync(packageDir);
  return packages
    .filter((p) => !p.endsWith('-e2e'))
    .map((project) => {
      const projectPkgPath = path.join(packageDir, project, 'package.json');
      const projectPkgContent = jsonfile.readFileSync(projectPkgPath, 'utf8');
      return {
        project,
        version: projectPkgContent.version,
      };
    });
};
