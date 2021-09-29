import { CAC } from 'cac';
import fs from 'fs-extra';
import path from 'path';
import prettier from 'prettier';
import jsonfile from 'jsonfile';
import consola from 'consola';
import chalk from 'chalk';
import { selectMultiProjects } from '../utils/select-project';
import { allPackages, availablePackages } from '../utils/packages';
import {
  ProjectWithVersion,
  readWorkspacePackagesWithVersion,
} from '../utils/read-packages';
import consolaGlobalInstance from 'consola';

const ALL_FLAG = 'all';

const workspacePackageInfo = readWorkspacePackagesWithVersion();

export function getPackageJSONPath(project: string) {
  return path.resolve(process.cwd(), 'packages', project, 'package.json');
}

export function updatePackageDeps(
  project: string,
  { project: dep, version }: ProjectWithVersion
) {
  const packageJSONPath = getPackageJSONPath(project);

  const origin = jsonfile.readFileSync(packageJSONPath);

  // all as dependencies ?
  origin.dependencies[dep] = `^${version}`;

  fs.writeFileSync(
    packageJSONPath,
    prettier.format(JSON.stringify(origin, null, 2), {
      parser: 'json-stringify',
    })
  );
}

export function handler(project: string) {
  const projectDeps: Record<string, string> = jsonfile.readFileSync(
    getPackageJSONPath(project)
  ).dependencies;

  const filteredProjectDeps: Record<string, string> = {};

  for (const dep of Object.keys(projectDeps).filter((dep) =>
    workspacePackageInfo.map((info) => info.project).includes(dep)
  )) {
    filteredProjectDeps[dep] = projectDeps[dep];
  }

  if (!Object.keys(filteredProjectDeps).length) {
    consola.info(
      `No workspace dependencies find for ${chalk.white(project)}, skipped.`
    );
  }

  for (const [dep, depVersion] of Object.entries(filteredProjectDeps)) {
    const mapped = workspacePackageInfo.find((info) => info.project === dep)!;

    consola.info(
      `${chalk.white(project)} is dependening on ${chalk.white(
        mapped.project
      )}, checking version...`
    );

    if (depVersion.replace('^', '').replace('~', '') !== mapped.version) {
      consola.info(
        `Mismatched workspace versio  detected，find: ${chalk.white(
          dep
        )}@${chalk.green(depVersion)}, expect: ${chalk.white(
          mapped.project
        )}@${chalk.green(mapped.version)}\n`
      );
      updatePackageDeps(project, mapped);
    } else {
      consola.info('No extra works needed, wuhu!\n');
    }
  }
}

export default function useSyncWorkspacePackageVersion(cli: CAC) {
  cli
    .command('sync [project]', 'Sync workspace package versions', {
      allowUnknownOptions: true,
    })
    .action(async (project?: string) => {
      if (project && allPackages.includes(project)) {
        handler(project);
        return;
      }

      const projects = await selectMultiProjects(
        [ALL_FLAG],
        'Choose project you want to collect dependencies for'
      );

      if (projects.includes(ALL_FLAG)) {
        for (const projectItem of availablePackages) {
          handler(projectItem);
        }
        return;
      }

      for (const projectItem of projects) {
        handler(projectItem);
      }
    });
}
