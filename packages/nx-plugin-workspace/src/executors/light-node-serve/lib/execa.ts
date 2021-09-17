import execa from 'execa';
import { from } from 'rxjs';
import {
  getNodeDevOptions,
  getTsNodeOptions,
  getExecaOptions,
} from './compose-options';
import { LightNodeServeExecutorSchema } from '../schema';

// ts-node-dev [node-dev|ts-node flags] [ts-node-dev flags] [node cli flags] [--] [script] [script arguments]
// tsnd
export const startExeca = (schema: LightNodeServeExecutorSchema) => {
  const { main } = schema;
  const tsNodeOptions = getTsNodeOptions(schema);
  const nodeDevOptions = getNodeDevOptions(schema);
  const execaOptions = getExecaOptions(schema);
  const extraScriptArgs = [];

  const commandArgs = [
    // ...nodeDevOptions,
    '--respawn',
    '--deps=1',
    '--debounce=200',
    ...tsNodeOptions,
    '--',
    main,
    ...extraScriptArgs,
  ];

  return from(
    execa('ts-node-dev', commandArgs, {
      stdio: 'inherit',
      preferLocal: true,
      ...execaOptions,
    })
  );
};
