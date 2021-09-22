import type {
  WorkspaceExecSchema,
  NormalizedCommandItem,
  NormalizedExecSchema,
} from './types';
import { parseArgs, normalizeCommand } from './helper';

export const normalizeSchema = (
  schema: WorkspaceExecSchema
): NormalizedExecSchema => {
  // extra args
  const parsedArgs = parseArgs(schema);

  const commands: NormalizedCommandItem[] = [];

  let parallel = true;

  if (schema.command) {
    commands.push({ command: schema.command });
    parallel = false;
  } else {
    commands.push(
      ...schema.commands.map((cmd) =>
        // aviod incorrect args
        typeof cmd === 'string' ? { command: cmd } : { command: cmd.command }
      )
    );
    // TODO: VERIFY
    parallel = schema.parallel;
  }

  commands.forEach((cmd) => {
    cmd.command = normalizeCommand(
      cmd.command,
      parsedArgs,
      cmd.forwardAllArgs ?? true
    );
  });

  return {
    ...schema,
    commands,
    parsedArgs,
    parallel,
    useCamelCase: schema.useCamelCase ?? false,
  };
};
