export interface RollupBuildSchema {
  entryFile: string;
  outputPath: string;
  tsconfigPath: string;

  watch: boolean;
}
