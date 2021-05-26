import { IceBuildCLIArgs } from '../utils/types';

export interface BuildExecutorSchema extends IceBuildCLIArgs {
  root: string;
}
