import {
  BasicNodeAppGenSchema,
  BasicNormalizedAppGenSchema,
} from 'nx-plugin-devkit';
import {
  PrismaGeneratorSchema,
  NormalizedPrismaGeneratorSchema,
} from '../utils/schema-types';

export interface PrismaSetupGeneratorSchema
  extends BasicNodeAppGenSchema,
    PrismaGeneratorSchema {
  override: boolean;
}

export interface NormalizedPrismaSetupGeneratorSchema
  extends NormalizedPrismaGeneratorSchema {
  override: boolean;
}
