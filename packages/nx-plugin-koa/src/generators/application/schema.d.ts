import type {
  BasicNodeAppGenSchema,
  BasicNormalizedAppGenSchema,
} from 'nx-plugin-devkit';

export interface KoaAppGeneratorExtraSchema {
  minimal: boolean;
  routingControllerBased: boolean;
  router: boolean;
}
export interface KoaAppGeneratorSchema
  extends BasicNodeAppGenSchema,
    Partial<KoaAppGeneratorExtraSchema> {}

export interface NormalizedKoaAppGeneratorSchema
  extends BasicNormalizedAppGenSchema,
    Required<KoaAppGeneratorExtraSchema> {}
