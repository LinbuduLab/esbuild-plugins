export type NormalizedCommandItem = {
  command: string;
  forwardAllArgs?: boolean;
};

export type CommandItem = NormalizedCommandItem | string;

export interface WorkspaceExecSchema {
  command?: string;
  commands: CommandItem[];
  color: boolean;
  parallel: boolean;
  cwd?: string;
  args?: string;
  envFile?: string;
  outputPath?: string | string[];
  useCamelCase: boolean;
  useLocalPackage: boolean;
  shell: boolean;
  ignoreFalsy: boolean;
}

export interface NormalizedExecSchema extends WorkspaceExecSchema {
  commands: NormalizedCommandItem[];
  parsedArgs: Record<string, string>;
}

export type InternalSchemaProps = keyof WorkspaceExecSchema;

// These options will not be passed to actual command
// FIXME: typings
export const internalSchemaProps: (InternalSchemaProps | string)[] = [
  'command',
  'commands',
  'color',
  'parallel',
  'cwd',
  'args',
  'envFile',
  'outputPath',
  'useCamelCase',
  'useLocalPackage',
  'ignoreFalsy',
  'shell',
];
