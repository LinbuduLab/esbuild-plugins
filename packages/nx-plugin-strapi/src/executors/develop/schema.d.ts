export interface DevelopExecutorSchema {
  cwd: string;
  noBuild: boolean;
  watchAdmin: boolean;
  browser: boolean | string;
}
