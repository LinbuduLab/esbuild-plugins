import type {
  CommandItem,
  DevkitExecSchema,
  NormalizedCommandItem,
  NormalizedExecSchema,
} from './types';
import { parseArgs, normalizeCommand } from './helper';

export const normalizeSchema = (
  schema: DevkitExecSchema
): NormalizedExecSchema => {
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
  };
};
