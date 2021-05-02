import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  installPackagesTask,
  GeneratorCallback,
  addDependenciesToPackageJson,
  readProjectConfiguration,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import fs from 'fs-extra';
import path from 'path';
import {
  createNodeInitTask,
  createNodeJestTask,
  createNodeLintTask,
  createNodeAppProject,
  createNodeAppFiles,
  setDefaultProject,
  setupProxy,
} from 'nx-plugin-devkit';
import { PrismaInitGeneratorSchema } from './schema';
import { normalizeSchema } from './lib/normalize-schema';

export default async function (host: Tree, schema: PrismaInitGeneratorSchema) {
  const normalizedSchema = normalizeSchema(host, schema);
  console.log('normalizedSchema: ', normalizedSchema);

  const tasks: GeneratorCallback[] = [];

  const initTask = await createNodeInitTask(host);
  tasks.push(initTask);

  createNodeAppFiles(
    host,
    normalizedSchema,
    path.join(__dirname, './files/app'),
    {
      SchemaName: normalizedSchema.schemaName,
    }
  );

  generateFiles(
    host,
    path.join(__dirname, './files/prisma'),
    normalizedSchema.prismaSchemaDir,
    {
      tmpl: '',
      SchemaName: normalizedSchema.schemaName,
      ClientProvider: normalizedSchema.clientProvider,
      ClientOutput: normalizedSchema.clientOutput,
      // FIXME: 转义'字符
      DatasourceURL: normalizedSchema.datasourceUrl.replace("'", '\\"'),
      DatasourceProvider: normalizedSchema.datasourceProvider,
    }
  );

  const envDBUrl =
    normalizedSchema.datasourceProvider === 'sqlite'
      ? 'file:../../db.sqlite'
      : 'SET_DATABASE_URL_HERE';

  if (normalizedSchema.useProjectEnv) {
    generateFiles(
      host,
      path.join(__dirname, './files/env'),
      normalizedSchema.projectRoot,
      {
        tmpl: '',
        DBURL: envDBUrl,
      }
    );
  } else {
    console.log('Or create env file at workspace root');
  }

  // 抽离到nx-plugin-devkit
  // createExecTargets
  const project: ProjectConfiguration & NxJsonProjectConfiguration = {
    root: normalizedSchema.projectRoot,
    sourceRoot: normalizedSchema.projectSourceRoot,
    projectType: 'application',
    targets: {},
  };

  // prisma generate
  project.targets['prisma-generate'] = {
    executor: 'nx-plugin-devkit:exec',
    options: {
      commands: ['prisma generate'],
      cwd: normalizedSchema.projectRoot,
      parallel: false,
      color: true,
      envFile: normalizedSchema.envFilePath,
      outputPath: normalizedSchema.prismaSchemaPath,
    },
  };

  addProjectConfiguration(host, normalizedSchema.projectName, project);

  const lintTask = await createNodeLintTask(host, normalizedSchema);
  tasks.push(lintTask);

  const jestTask = await createNodeJestTask(host, normalizedSchema);
  tasks.push(jestTask);

  await formatFiles(host);

  setDefaultProject(host, normalizedSchema);

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
