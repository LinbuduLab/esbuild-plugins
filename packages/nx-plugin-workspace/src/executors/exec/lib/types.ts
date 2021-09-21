export type NormalizedCommandItem = {
  command: string;
  forwardAllArgs?: boolean;
};

export type CommandItem = NormalizedCommandItem | string;

export interface WorkspaceExecSchema {
  command?: string;
  commands: CommandItem[];
  color?: boolean;
  parallel?: boolean;
  cwd?: string;
  args?: string;
  envFile?: string;
  outputPath?: string | string[];
  useCamelCase?: boolean;
  useLocalPackage?: boolean;
  shell: boolean;
}

export interface NormalizedExecSchema extends WorkspaceExecSchema {
  commands: NormalizedCommandItem[];
  parsedArgs: Record<string, string>;
}

export type SchemaProps = keyof WorkspaceExecSchema;

export const schemaProps: (SchemaProps | string)[] = [
  'command',
  'commands',
  'color',
  'parallel',
  'cwd',
  'args',
  'envFile',
  'outputPath',
  'useLocalPackage',
  'shell',
];
