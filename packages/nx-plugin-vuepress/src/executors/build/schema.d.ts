export interface VuePressBuildSchema {
  root: string;
  docsDir: string;

  configPath: string;

  dest: string;
  temp: string;
  cache: string;

  cleanTemp: boolean;
  cleanCache: boolean;
  debug: boolean;
}
