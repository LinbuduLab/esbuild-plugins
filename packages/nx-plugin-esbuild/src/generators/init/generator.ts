import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
  installPackagesTask,
  joinPathFragments,
  GeneratorCallback,
  addDependenciesToPackageJson,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
import { jestProjectGenerator } from '@nrwl/jest';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { Linter, lintProjectGenerator } from '@nrwl/linter';
import path from 'path';
import { normalizeSchema } from './lib/normalize-schema';
import { composeDepsList, composeDevDepsList } from './lib/compose-deps';
import { NormalizedESBuildInitGeneratorSchema } from './schema';

export default async function (
  host: Tree,
  schema: NormalizedESBuildInitGeneratorSchema
) {
  const normalizedSchema = normalizeSchema(host, schema);

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

  const tasks: GeneratorCallback[] = [];

  const jestTask = await jestProjectGenerator(host, {
    project: normalizedSchema.projectName,
    setupFile: 'none',
    supportTsx: true,
    babelJest: true,
    testEnvironment: 'node',
  });

  const lintTask = await lintProjectGenerator(host, {
    linter: Linter.EsLint,
    project: schema.projectName,
    tsConfigPaths: [joinPathFragments(schema.projectRoot, 'tsconfig.app.json')],
    eslintFilePatterns: [`${schema.projectRoot}/**/*.ts`],
    skipFormat: true,
  });

  tasks.push(jestTask, lintTask);

  const workspace = readWorkspaceConfiguration(host);

  if (!workspace.defaultProject) {
    workspace.defaultProject = schema.projectRoot;
    updateWorkspaceConfiguration(host, workspace);
  }

  await formatFiles(host);

  const deps = composeDepsList(normalizedSchema);
  const devDeps = composeDevDepsList(normalizedSchema);

  addDependenciesToPackageJson(host, deps, devDeps);

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
