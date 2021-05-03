import fs from 'fs-extra';
import jsonfile from 'jsonfile';
import prettier from 'prettier';
import path from 'path';
import { ProjectConfiguration } from '@nrwl/devkit';

const pluginOrders = ['nx', 'esbuild', 'vite', 'snowpack', 'vitepress', 'umi'];

const nxJsonPath = path.join(process.cwd(), 'nx.json');
const tsconfigJsonPath = path.join(process.cwd(), 'tsconfig.base.json');
const workspaceJsonPath = path.join(process.cwd(), 'workspace.json');

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
  const otherProjects: Record<string, NxJsonProjectItem> = {};

  for (const [k, v] of Object.entries(projects)) {
    if (k.startsWith('nx')) {
      nxProjects[k] = v;
    } else if (k.startsWith('esbuild')) {
      esbuildProjects[k] = v;
    } else if (k.startsWith('vite')) {
      viteProjects[k] = v;
    } else {
      otherProjects[k] = v;
    }
  }

  const sortedProjects = {
    ...nxProjects,
    ...esbuildProjects,
    ...viteProjects,
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
  const otherProjects: Record<string, string[]> = {};

  for (const [k, v] of Object.entries(paths)) {
    if (k.startsWith('nx')) {
      nxProjects[k] = v;
    } else if (k.startsWith('esbuild')) {
      esbuildProjects[k] = v;
    } else if (k.startsWith('vite')) {
      viteProjects[k] = v;
    } else {
      otherProjects[k] = v;
    }
  }

  const sortedProjects = {
    ...nxProjects,
    ...esbuildProjects,
    ...viteProjects,
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
  const otherProjects: Record<string, ProjectConfiguration> = {};

  for (const [k, v] of Object.entries(projects)) {
    if (k.startsWith('nx')) {
      nxProjects[k] = v;
    } else if (k.startsWith('esbuild')) {
      esbuildProjects[k] = v;
    } else if (k.startsWith('vite')) {
      viteProjects[k] = v;
    } else {
      otherProjects[k] = v;
    }
  }

  const sortedProjects = {
    ...nxProjects,
    ...esbuildProjects,
    ...viteProjects,
    ...otherProjects,
  };

  workspaceJsonContent.projects = sortedProjects;

  fs.writeFileSync(
    workspaceJsonPath,
    prettier.format(JSON.stringify(workspaceJsonContent), { parser: 'json' })
  );
}

function main() {
  sortPluginInNxJson();
  sortPluginInTsconfigJson();
  sortPluginInWorkspaceJson();
}

main();
