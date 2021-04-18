import { Tree } from '@nrwl/devkit';
import { normalizeNodeAppSchema } from 'nx-plugin-devkit';

import {
  ESBuildInitGeneratorSchema,
  NormalizedESBuildInitGeneratorSchema,
  ESBuildInitGeneratorExtraSchema,
} from '../schema';

export function normalizeSchema(
  host: Tree,
  schema: ESBuildInitGeneratorSchema
): NormalizedESBuildInitGeneratorSchema {
  const basicNormalizedAppGenSchema = normalizeNodeAppSchema(host, schema);

  const { projectName, projectRoot } = basicNormalizedAppGenSchema;

  const extraOptions: ESBuildInitGeneratorExtraSchema = {
    main: schema.main ?? `${projectRoot}/src/main.ts`,
    outputPath: schema.outputPath ?? `dist/apps/${projectName}`,
    tsConfigPath: schema.tsConfigPath ?? `${projectRoot}/tsconfig.app.json`,
    assets: schema.assets ?? [`${projectRoot}/src/assets`],

    watch: schema.watch ?? false,
    useTSCPluginForDecorator: schema.useTSCPluginForDecorator ?? true,
  };

  return {
    ...extraOptions,
    ...basicNormalizedAppGenSchema,
  };
}
