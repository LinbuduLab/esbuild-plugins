import { NodeAppServeExecutorSchema } from '../../utils';

export interface NodeServeExecutorSchema extends NodeAppServeExecutorSchema {}

export interface NormalizedNodeServeExecutorSchema
  extends NodeServeExecutorSchema {
  execArgs: string[];
}
