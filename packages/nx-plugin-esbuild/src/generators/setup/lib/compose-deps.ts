import { ESBUILD_DEP_VERSION } from '../../utils/constants';
import { NormalizedESBuildSetupGeneratorSchema } from '../schema';

export function composeDepsList(
  schema: NormalizedESBuildSetupGeneratorSchema
): Record<string, string> {
  const basic: Record<string, string> = {};

  return basic;
}

export function composeDevDepsList(
  schema: NormalizedESBuildSetupGeneratorSchema
): Record<string, string> {
  const basic = {
    esbuild: ESBUILD_DEP_VERSION,
    'esbuild-plugin-decorator': 'latest',
    'esbuild-plugin-node-externals': 'latest',
  };

  return basic;
}
