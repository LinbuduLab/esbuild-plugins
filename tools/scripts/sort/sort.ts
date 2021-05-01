import fs from 'fs-extra';
import jsonfile from 'jsonfile';
import prettier from 'prettier';
import path from 'path';

const pluginOrders = ['nx', 'esbuild', 'vite', 'snowpack', 'vitepress', 'umi'];

const nxJsonPath = path.join(process.cwd(), 'nx.json');
const tsconfigJsonPath = path.join(process.cwd(), 'tsconfig.base.json');
const workspaceJsonPath = path.join(process.cwd(), 'wporkspace.json');

function sortPluginInNxJson() {}
function sortPluginInTsconfigJson() {}
function sortPluginInWorkspaceJson() {}

export function main() {
  sortPluginInNxJson();
  sortPluginInTsconfigJson();
  sortPluginInWorkspaceJson();
}
