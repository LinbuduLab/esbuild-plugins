import {
  formatFiles,
  Tree,
  installPackagesTask,
  GeneratorCallback,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import path from 'path';
import { normalizeSchema } from './lib/normalize-schema';
import { composeDepsList, composeDevDepsList } from './lib/compose-deps';
import { ESBuildInitGeneratorSchema } from './schema';
import {
  createNodeInitTask,
  createNodeJestTask,
  createNodeLintTask,
  createNodeAppProject,
  createNodeAppFiles,
  setDefaultProject,
  setupProxy,
} from 'nx-plugin-devkit';

export default async function (host: Tree, schema: ESBuildInitGeneratorSchema) {
  const normalizedSchema = normalizeSchema(host, schema);

  const {
    projectName,
    projectRoot,
    parsedTags,
    offsetFromRoot,
    watch,
    projectSourceRoot,
    entry,
    outputPath,
    tsconfigPath: tsConfig,
    assets,
    override,
  } = normalizedSchema;

  const tasks: GeneratorCallback[] = [];

  const initTask = await createNodeInitTask(host);
  tasks.push(initTask);

  const buildTargetName = override ? 'esbuild' : 'build';
  const serveTargetName = override ? 'esserve' : 'serve';

  createNodeAppProject(
    host,
    normalizedSchema,
    {
      executor: 'nx-plugin-esbuild:build',
      options: {
        main: entry,
        tsConfig,
        outputPath,
        watch,
        assets,
        bundle: true,
      },
      configurations: {
        production: {
          fileReplacements: [
            {
              replace: `${projectSourceRoot}/environments/environment.ts`,
              with: `${projectSourceRoot}/environments/environment.prod.ts`,
            },
          ],
          aliases: [
            {
              from: './environments/environment',
              to: path.resolve(
                process.cwd(),
                projectSourceRoot,
                './environments/environment.prod.ts'
              ),
            },
          ],
        },
      },
    },
    {
      executor: 'nx-plugin-esbuild:serve',
      options: {
        buildTarget: `${projectName}:${buildTargetName}`,
      },
    },
    {
      executor: 'nx-plugin-esbuild:serve',
      options: {
        // TODO: configurate by schema option
        buildTarget: `${projectName}:${buildTargetName}:production`,
      },
    },
    buildTargetName,
    serveTargetName,
    'serve-prod'
  );

  createNodeAppFiles(host, normalizedSchema, path.join(__dirname, './files'));

  const lintTask = await createNodeLintTask(host, normalizedSchema);
  tasks.push(lintTask);

  const jestTask = await createNodeJestTask(host, normalizedSchema);
  tasks.push(jestTask);

  setupProxy(host, normalizedSchema);
  setDefaultProject(host, normalizedSchema);

  await formatFiles(host);

  const deps = composeDepsList(normalizedSchema);
  const devDeps = composeDevDepsList(normalizedSchema);

  addDependenciesToPackageJson(host, deps, devDeps);

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
