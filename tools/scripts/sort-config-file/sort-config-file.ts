import fs from 'fs-extra';
import jsonfile from 'jsonfile';
import prettier from 'prettier';
import path from 'path';
import { ProjectConfiguration } from '@nrwl/devkit';

const pluginOrders = [
  'nx',
  'esbuild',
  'vite',
  'snowpack',
  'vitepress',
  'umi',
  'parcel',
];

const nxJsonPath = path.join(process.cwd(), 'nx.json');
const tsconfigJsonPath = path.join(process.cwd(), 'tsconfig.base.json');
const workspaceJsonPath = path.join(process.cwd(), 'workspace.json');
const jestConfigFilePath = path.join(process.cwd(), 'jest.config.js');

interface NxJsonProjectItem {
  tags: string[];
  implicitDependencies: string[];
}

function sortPluginInNxJson() {
  const nxJsonContent = jsonfile.readFileSync(nxJsonPath, 'utf8');
  const projects: Record<string, NxJsonProjectItem> = nxJsonContent.projects;
  const nxProjects: Record<string, NxJsonProjectItem> = {};
  const esbuildProjects: Record<string, NxJsonProjectItem> = {};
  const viteProjects: Record<string, NxJsonProjectItem> = {};
  const snowpackProjects: Record<string, NxJsonProjectItem> = {};
  const rollupProjects: Record<string, NxJsonProjectItem> = {};
  const parcelProjects: Record<string, NxJsonProjectItem> = {};
  const otherProjects: Record<string, NxJsonProjectItem> = {};

  for (const [k, v] of Object.entries(projects)) {
    if (k.startsWith('nx')) {
      nxProjects[k] = v;
    } else if (k.startsWith('esbuild')) {
      esbuildProjects[k] = v;
    } else if (k.startsWith('vite')) {
      viteProjects[k] = v;
    } else if (k.startsWith('snowpack')) {
      snowpackProjects[k] = v;
    } else if (k.startsWith('rollup')) {
      rollupProjects[k] = v;
    } else if (k.startsWith('parcel')) {
      parcelProjects[k] = v;
    } else {
      otherProjects[k] = v;
    }
  }

  const sortedProjects = {
    ...nxProjects,
    ...esbuildProjects,
    ...viteProjects,
    ...snowpackProjects,
    ...rollupProjects,
    ...parcelProjects,
    ...otherProjects,
  };

  nxJsonContent.projects = sortedProjects;

  fs.writeFileSync(
    nxJsonPath,
    prettier.format(JSON.stringify(nxJsonContent), { parser: 'json' })
  );
}

function sortPluginInTsconfigJson() {
  const tsconfigJsonContent = jsonfile.readFileSync(tsconfigJsonPath, 'utf8');
  const paths: Record<string, string[]> =
    tsconfigJsonContent.compilerOptions.paths;
  const nxProjects: Record<string, string[]> = {};
  const esbuildProjects: Record<string, string[]> = {};
  const viteProjects: Record<string, string[]> = {};
  const snowpackProjects: Record<string, string[]> = {};
  const rollupProjects: Record<string, string[]> = {};
  const parcelProjects: Record<string, string[]> = {};
  const otherProjects: Record<string, string[]> = {};

  for (const [k, v] of Object.entries(paths)) {
    if (k.startsWith('nx')) {
      nxProjects[k] = v;
    } else if (k.startsWith('esbuild')) {
      esbuildProjects[k] = v;
    } else if (k.startsWith('vite')) {
      viteProjects[k] = v;
    } else if (k.startsWith('snowpack')) {
      snowpackProjects[k] = v;
    } else if (k.startsWith('rollup')) {
      rollupProjects[k] = v;
    } else if (k.startsWith('parcel')) {
      parcelProjects[k] = v;
    } else {
      otherProjects[k] = v;
    }
  }

  const sortedProjects = {
    ...nxProjects,
    ...esbuildProjects,
    ...viteProjects,
    ...snowpackProjects,
    ...rollupProjects,
    ...parcelProjects,
    ...otherProjects,
  };

  tsconfigJsonContent.compilerOptions.paths = sortedProjects;

  fs.writeFileSync(
    tsconfigJsonPath,
    prettier.format(JSON.stringify(tsconfigJsonContent), { parser: 'json' })
  );
}
function sortPluginInWorkspaceJson() {
  const workspaceJsonContent = jsonfile.readFileSync(workspaceJsonPath, 'utf8');
  const projects: Record<string, ProjectConfiguration> =
    workspaceJsonContent.projects;

  const nxProjects: Record<string, ProjectConfiguration> = {};
  const esbuildProjects: Record<string, ProjectConfiguration> = {};
  const viteProjects: Record<string, ProjectConfiguration> = {};
  const snowpackProjects: Record<string, ProjectConfiguration> = {};
  const rollupProjects: Record<string, ProjectConfiguration> = {};
  const parcelProjects: Record<string, ProjectConfiguration> = {};
  const otherProjects: Record<string, ProjectConfiguration> = {};

  for (const [k, v] of Object.entries(projects)) {
    if (k.startsWith('nx')) {
      nxProjects[k] = v;
    } else if (k.startsWith('esbuild')) {
      esbuildProjects[k] = v;
    } else if (k.startsWith('vite')) {
      viteProjects[k] = v;
    } else if (k.startsWith('snowpack')) {
      snowpackProjects[k] = v;
    } else if (k.startsWith('rollup')) {
      rollupProjects[k] = v;
    } else if (k.startsWith('parcel')) {
      parcelProjects[k] = v;
    } else {
      otherProjects[k] = v;
    }
  }

  const sortedProjects = {
    ...nxProjects,
    ...esbuildProjects,
    ...viteProjects,
    ...snowpackProjects,
    ...rollupProjects,
    ...parcelProjects,
    ...otherProjects,
  };

  workspaceJsonContent.projects = sortedProjects;

  fs.writeFileSync(
    workspaceJsonPath,
    prettier.format(JSON.stringify(workspaceJsonContent), { parser: 'json' })
  );
}

function sortPluginInJestConfigFile() {
  const jestConfigFileContent: {
    projects: string[];
  } = require(jestConfigFilePath);

  const nxProjects: string[] = [];
  const esbuildProjects: string[] = [];
  const viteProjects: string[] = [];
  const snowpackProjects: string[] = [];
  const rollupProjects: string[] = [];
  const parcelProjects: string[] = [];
  const otherProjects: string[] = [];

  for (const project of jestConfigFileContent.projects.map((p) =>
    p.replace('\\', '/')
  )) {
    if (project.includes('nx-plugin-')) {
      nxProjects.push(project);
    } else if (project.includes('esbuild-plugin-')) {
      esbuildProjects.push(project);
    } else if (project.includes('vite-plugin-')) {
      viteProjects.push(project);
    } else if (project.includes('snowpack-plugin-')) {
      snowpackProjects.push(project);
    } else if (project.includes('rollup-plugin-')) {
      rollupProjects.push(project);
    } else if (project.includes('parcel-plugin-')) {
      parcelProjects.push(project);
    } else {
      otherProjects.push(project);
    }
  }

  const sortedProjects = [
    ...nxProjects,
    ...esbuildProjects,
    ...viteProjects,
    ...snowpackProjects,
    ...rollupProjects,
    ...parcelProjects,
    ...otherProjects,
  ].map((p) => `"${p}"`);

  const updatedContent = `module.exports = { projects:[${sortedProjects}] }`;

  fs.writeFileSync(
    jestConfigFilePath,
    prettier.format(updatedContent, { parser: 'babel' })
  );
}

function main() {
  sortPluginInNxJson();
  sortPluginInTsconfigJson();
  sortPluginInWorkspaceJson();
  sortPluginInJestConfigFile();
}

main();
