import { CAC } from 'cac';
import consola from 'consola';
import chalk from 'chalk';
import fs from 'fs-extra';
import jsonfile from 'jsonfile';
import prettier from 'prettier';
import path from 'path';
import nxJSON from '../../nx.json';
import workspaceJSON from '../../workspace.json';
import tsconfigJSON from '../../tsconfig.base.json';

const nxJsonPath = path.join(process.cwd(), 'nx.json');
const tsconfigJsonPath = path.join(process.cwd(), 'tsconfig.base.json');
const workspaceJsonPath = path.join(process.cwd(), 'workspace.json');
const jestConfigFilePath = path.join(process.cwd(), 'jest.config.js');

interface NxJsonProjectItem {
  tags?: string[];
  implicitDependencies?: string[];
}

export default function useSortConfiguration(cli: CAC) {
  cli
    .command('sort', 'Sort all configuration file', {
      allowUnknownOptions: true,
    })
    .alias('s')
    .action(() => {
      consola.info('Sorting nx.json...');
      sortPluginInNxJson();
      consola.info('Sorting tsconfig.json...');
      sortPluginInTsconfigJson();
      consola.info('Sorting workspace.json...');
      sortPluginInWorkspaceJson();
      consola.info('Sorting jest.config.js...');
      sortPluginInJestConfigFile();

      consola.success('Sort finished.');
    });
}

function sortPluginInNxJson() {
  const nxJsonContent: typeof nxJSON = jsonfile.readFileSync(
    nxJsonPath,
    'utf8'
  );

  const projects: Record<string, NxJsonProjectItem> = nxJsonContent.projects;

  const projectMap: Record<string, string[]> = {
    playground: [],
  };

  for (const [k, v] of Object.entries(projects)) {
    const key = k.split('-')[0];

    if (k.endsWith('-app') || k.endsWith('-playground')) {
      projectMap['playground'].push(k);
    } else {
      if (!projectMap[key]) {
        projectMap[key] = [];
      }
      projectMap[key].push(k);
    }
  }

  const sortedProjectMap: Record<string, string[]> = {
    nx: projectMap['nx'],
    esbuild: projectMap['esbuild'],
    snowpack: projectMap['snowpack'],
    vite: projectMap['vite'],
    gatsby: projectMap['gatsby'],
    playground: projectMap['playground'],
    ...projectMap,
  };

  const tmpProjects: Record<string, NxJsonProjectItem> = {};

  for (const [k, v] of Object.entries(sortedProjectMap)) {
    v &&
      v.forEach((projectName) => {
        tmpProjects[projectName] = nxJsonContent.projects[projectName];
      });
  }

  nxJsonContent.projects = tmpProjects as any;

  fs.writeFileSync(
    nxJsonPath,
    prettier.format(JSON.stringify(nxJsonContent), { parser: 'json' })
  );
}

function sortPluginInTsconfigJson() {
  const tsconfigJsonContent: typeof tsconfigJSON = jsonfile.readFileSync(
    tsconfigJsonPath,
    'utf8'
  );

  const paths: Record<string, string[]> =
    tsconfigJsonContent.compilerOptions.paths;

  const projectMap: Record<string, string[]> = {
    playground: [],
  };

  for (const [k, v] of Object.entries(paths)) {
    const key = k.split('-')[0];

    if (k.endsWith('-app') || k.endsWith('-playground')) {
      projectMap['playground'].push(k);
    } else {
      if (!projectMap[key]) {
        projectMap[key] = [];
      }
      projectMap[key].push(k);
    }
  }

  const sortedProjectMap: Record<string, string[]> = {
    nx: projectMap['nx'],
    esbuild: projectMap['esbuild'],
    snowpack: projectMap['snowpack'],
    vite: projectMap['vite'],
    gatsby: projectMap['gatsby'],
    playground: projectMap['playground'],
    ...projectMap,
  };

  const tmpProjects: Record<string, string[]> = {};

  for (const [k, v] of Object.entries(sortedProjectMap)) {
    v &&
      v.forEach((projectName) => {
        tmpProjects[projectName] =
          tsconfigJsonContent.compilerOptions.paths[projectName];
      });
  }

  tsconfigJsonContent.compilerOptions.paths = tmpProjects as any;

  fs.writeFileSync(
    tsconfigJsonPath,
    prettier.format(JSON.stringify(tsconfigJsonContent), { parser: 'json' })
  );
}

function sortPluginInWorkspaceJson() {
  const workspaceJsonContent: typeof workspaceJSON = jsonfile.readFileSync(
    workspaceJsonPath,
    'utf8'
  );

  const projects = workspaceJsonContent.projects;

  const projectMap: Record<string, string[]> = {
    playground: [],
  };

  for (const [k, v] of Object.entries(projects)) {
    const key = k.split('-')[0];

    if (k.endsWith('-app') || k.endsWith('-playground')) {
      projectMap['playground'].push(k);
    } else {
      if (!projectMap[key]) {
        projectMap[key] = [];
      }
      projectMap[key].push(k);
    }
  }

  const sortedProjectMap: Record<string, string[]> = {
    nx: projectMap['nx'],
    esbuild: projectMap['esbuild'],
    snowpack: projectMap['snowpack'],
    vite: projectMap['vite'],
    gatsby: projectMap['gatsby'],
    playground: projectMap['playground'],
    ...projectMap,
  };

  const tmpProjects: Record<string, NxJsonProjectItem> = {};

  for (const [k, v] of Object.entries(sortedProjectMap)) {
    v &&
      v.forEach((projectName) => {
        tmpProjects[projectName] = workspaceJsonContent.projects[projectName];
      });
  }

  workspaceJsonContent.projects = tmpProjects as any;

  fs.writeFileSync(
    workspaceJsonPath,
    prettier.format(JSON.stringify(workspaceJsonContent), { parser: 'json' })
  );
}

function sortPluginInJestConfigFile() {
  const {
    projects,
  }: {
    projects: string[];
  } = require(jestConfigFilePath);

  const projectMap: Record<string, string[]> = {
    packages: [],
    playground: [],
  };

  for (const k of projects.map((p) => p.replace('\\', '/'))) {
    const key = k.includes('/packages/')
      ? k.split('/packages/')[1].split('-')[0]
      : 'playground';

    if (k.endsWith('-app') || k.endsWith('-playground')) {
      projectMap['playground'].push(k);
    } else {
      if (!projectMap[key]) {
        projectMap[key] = [];
      }
      projectMap[key].push(k);
    }
  }
  const sortedProjectMap: Record<string, string[]> = {
    nx: projectMap['nx'],
    esbuild: projectMap['esbuild'],
    snowpack: projectMap['snowpack'],
    vite: projectMap['vite'] ?? [],
    gatsby: projectMap['gatsby'] ?? [],
    playground: projectMap['playground'],
    ...projectMap,
  };

  const tmpProjects: string[] = [
    ...sortedProjectMap['nx'],
    ...sortedProjectMap['esbuild'],
    ...sortedProjectMap['snowpack'],
    ...sortedProjectMap['vite'],
    ...sortedProjectMap['gatsby'],
    ...sortedProjectMap['playground'],
  ].map((p) => `"${p}"`);

  const updatedContent = `module.exports = { projects:[${tmpProjects}]}`;

  fs.writeFileSync(
    jestConfigFilePath,
    prettier.format(updatedContent, { parser: 'babel' })
  );
}
