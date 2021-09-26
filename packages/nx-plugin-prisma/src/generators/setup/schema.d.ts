import { BasicNodeAppGenSchema } from 'nx-plugin-devkit';
import {
  PrismaGeneratorSchema,
  NormalizedPrismaGeneratorSchema,
} from '../utils/schema-types';

export interface PrismaSetupGeneratorSchema
  extends BasicNodeAppGenSchema,
    PrismaGeneratorSchema {
  latestPackage: boolean;
}

export interface NormalizedPrismaSetupGeneratorSchema
  extends NormalizedPrismaGeneratorSchema {
  latestPackage: boolean;
}
