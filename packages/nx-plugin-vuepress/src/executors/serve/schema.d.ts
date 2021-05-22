export interface VuePressServeSchema {
  root: string;
  docsDir: string;

  configPath: string;
  host: string;
  port: number;
  temp?: string;
  cache?: string;
  cleanTemp: boolean;
  cleanCache: boolean;
  open: boolean;
  debug: boolean;
  noWatch: boolean;

  // display full command executed
  verbose: boolean;
}
