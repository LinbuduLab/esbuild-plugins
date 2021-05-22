import type {
  BasicNodeAppGenSchema,
  BasicNormalizedAppGenSchema,
} from 'nx-plugin-devkit';

export interface VitePressInitGeneratorExtraSchema {
  generateViteConfig: boolean;
  overrideTargets: boolean;
}

export interface NormalizedVitePressInitGeneratorExtraSchema
  extends BasicNodeAppGenSchema,
    VitePressInitGeneratorExtraSchema {}
