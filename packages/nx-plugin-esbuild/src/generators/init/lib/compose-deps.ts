import { ESBUILD_DEP_VERSION } from '../../utils/constants';
import { NormalizedESBuildInitGeneratorSchema } from '../schema';

export function composeDepsList(
  schema: NormalizedESBuildInitGeneratorSchema
): Record<string, string> {
  const basic: Record<string, string> = {};

  return basic;
}

export function composeDevDepsList(
  schema: NormalizedESBuildInitGeneratorSchema
): Record<string, string> {
  const basic = {
    esbuild: ESBUILD_DEP_VERSION,
  };

  return basic;
}
