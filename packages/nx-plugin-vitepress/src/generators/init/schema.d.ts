import type {
  BasicNodeAppGenSchema,
  BasicNormalizedAppGenSchema,
} from 'nx-plugin-devkit';

export interface VitePressInitGeneratorExtraSchema {
  generateViteConfig: boolean;
  generateConfig: boolean;
  overrideTargets: boolean;
}

export interface NormalizedVitePressInitGeneratorExtraSchema
  extends BasicNodeAppGenSchema,
    VitePressInitGeneratorExtraSchema {}
