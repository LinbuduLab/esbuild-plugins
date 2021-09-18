import {
  SnowpackSharedSchema,
  NormalizedSnowpackSharedSchema,
} from '../../utils/types';

export interface SnowpackServeSchema extends SnowpackSharedSchema {
  verbose: string;
  clearCache: boolean;
  open: string;
}

export interface NormalizedSnowpackServeSchema
  extends SnowpackServeSchema,
    NormalizedSnowpackSharedSchema {
  workspaceRoot: string;
}
