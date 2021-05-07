import { Tree } from '@nrwl/devkit';
import {
  LightNodeServeExecutorSchema,
  NormalizedLightNodeServeExecutorSchema,
} from '../schema';
import {
  getNodeDevOptions,
  getTsNodeOptions,
  getExecaOptions,
} from './preset-options';

// TODO: append preset options here
export function normalizeSchema(
  host: Tree,
  schema: LightNodeServeExecutorSchema
): NormalizedLightNodeServeExecutorSchema {
  if (!host.exists(schema.main)) {
    throw new Error('');
  }

  if (!host.exists(schema.tsConfig)) {
    throw new Error('');
  }

  return schema;
}
