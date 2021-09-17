import fs from 'fs-extra';
import path from 'path';
import jsonfile from 'jsonfile';

type ProjectWithVersion = {
  project: string;
  version: string;
};

export const readPackagesWithVersion = (): ProjectWithVersion[] => {
  const packageDir = path.join(process.cwd(), 'packages');
  const packages = fs.readdirSync(packageDir);
  return packages.map((project) => {
    const projectPkgPath = path.join(packageDir, project, 'package.json');
    const projectPkgContent = jsonfile.readFileSync(projectPkgPath, 'utf8');
    return {
      project,
      version: projectPkgContent.version,
    };
  });
};
