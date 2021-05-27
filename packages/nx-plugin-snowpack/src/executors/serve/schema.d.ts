import {
  SnowpackSharedSchema,
  NormalizedSnowpackSharedSchema,
} from '../../utils/types';

export interface SnowpackServeSchema extends SnowpackSharedSchema {}

export interface NormalizedSnowpackServeSchema
  extends SnowpackServeSchema,
    NormalizedSnowpackSharedSchema {
  workspaceRoot: string;
}
