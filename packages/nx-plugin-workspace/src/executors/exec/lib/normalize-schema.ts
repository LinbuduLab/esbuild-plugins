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
    // when there's only one command, execute it synchronously
    commands.push({ command: schema.command });
    parallel = false;
  } else {
    commands.push(
      ...schema.commands.map((cmd) =>
        typeof cmd === 'string' ? { command: cmd } : { command: cmd.command }
      )
    );
    // control by options
    parallel = schema.parallel;
  }

  commands.forEach((cmd) => {
    cmd.command = normalizeCommand(
      cmd.command,
      parsedArgs,
      // command level
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
