export interface UmiInfoExecutorSchema {
  plugin: boolean;
  version: boolean;
  webpack: boolean;
  verboseWebpackReport: boolean;

  cwd?: string;
}
