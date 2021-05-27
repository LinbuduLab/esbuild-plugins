import {
  SnowpackSharedSchema,
  NormalizedSnowpackSharedSchema,
} from '../../utils/types';

export interface SnowpackBuildSchema extends SnowpackSharedSchema {
  clearCache: boolean;
  verbose: boolean;
  watch: boolean;
}

export interface NormalizedSnowpackBuildSchema
  extends SnowpackBuildSchema,
    NormalizedSnowpackSharedSchema {
  workspaceRoot: string;
}
