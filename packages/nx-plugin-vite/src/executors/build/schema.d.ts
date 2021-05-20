export interface ViteBuildSchema {
  root: string;
  configFile: string;

  // dist -> apps/vite-app/dist
  outDir: string;
  // dist/vite-app -> WORKSPACE_ROOT/dist/vite-app
  emitAtRootLevel: boolean;
  watch: boolean;
  write: boolean;
}
