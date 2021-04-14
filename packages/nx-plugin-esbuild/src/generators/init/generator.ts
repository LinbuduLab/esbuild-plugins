import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
  installPackagesTask,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';
import path from 'path';
import { normalizeSchema } from './lib/normalize-schema';
import { composeDepsList, composeDevDepsList } from './lib/compose-deps';
import { NormalizedESBuildInitGeneratorSchema } from './schema';

export default async function (
  host: Tree,
  schema: NormalizedESBuildInitGeneratorSchema
) {
  const normalizedSchema = normalizeSchema(host, schema);
  console.log('normalizedSchema: ', normalizedSchema);

  const {
    projectName,
    projectRoot,
    parsedTags,
    offsetFromRoot,
    watch,
    main,
    outputPath,
    tsConfigPath: tsConfig,
    assets,
  } = normalizedSchema;

  addProjectConfiguration(host, projectName, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {
      build: {
        executor: 'nx-plugin-esbuild:build',
        options: {
          main,
          tsConfig,
          outputPath,
          watch,
          assets,
        },
      },
    },
    tags: parsedTags,
  });

  generateFiles(host, path.join(__dirname, './files'), projectRoot, {
    tmpl: '',
    offset: offsetFromRoot,
  });

  await formatFiles(host);

  const deps = composeDepsList(normalizedSchema);
  const devDeps = composeDevDepsList(normalizedSchema);

  addDependenciesToPackageJson(host, deps, devDeps);

  return () => {
    installPackagesTask(host);
  };
}
