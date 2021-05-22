import type {
  BasicNodeAppGenSchema,
  BasicNormalizedAppGenSchema,
} from 'nx-plugin-devkit';

export interface VitePressInitGeneratorExtraSchema {
  generateFiles: boolean;
  overrideTargets: boolean;
  initAsApp: boolean;
}

export interface NormalizedVitePressInitGeneratorExtraSchema
  extends BasicNodeAppGenSchema,
    VitePressInitGeneratorExtraSchema {}
