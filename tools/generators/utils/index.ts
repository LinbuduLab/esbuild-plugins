export const workspaceName = '@penumbra/nx-plugins';
export const defaultNPMScope = '@penumbra';
export const workspaceRoot = __dirname;
export const packageManager = 'pnpm';

export const nxPluginPrefix = 'nx-plugin';
export const esbuildPluginPrefix = 'nx-plugin';
export const vitePluginPrefix = 'vite-plugin';
export const umiPluginPrefix = 'umi-plugin';
export const snowpackPluginPrefix = 'snowpack-plugin';

export interface PluginGeneratorSchema {
  name: string;
  tags?: string;
  importPath?: string;
  executor: boolean;
  generator: boolean;
  directory?: string;
}

export interface NormalizedPluginGeneratorSchema extends PluginGeneratorSchema {
  importPath: string;
  parsedTags: string[];
  // workspaceRoot: string;
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;
  projectDirectory: string;
  npmScope: string;
  npmPackageName: string;
}
