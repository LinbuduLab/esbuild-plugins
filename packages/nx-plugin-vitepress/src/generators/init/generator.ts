import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  joinPathFragments,
  getWorkspaceLayout,
  Tree,
  installPackagesTask,
  GeneratorCallback,
  addDependenciesToPackageJson,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
  normalizePath,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import path from 'path';
import {
  normalizeNodeAppSchema,
  createNodeInitTask,
  createNodeJestTask,
  createNodeLintTask,
  setDefaultProject,
  getAvailableAppsOrLibs,
} from 'nx-plugin-devkit';

import { NormalizedVitePressInitGeneratorExtraSchema } from './schema';

// vitepress init命令中，不需要设定entry、tsconfigPath

export default async function (
  host: Tree,
  schema: NormalizedVitePressInitGeneratorExtraSchema
) {
  const { apps } = getAvailableAppsOrLibs(host);

  const appNames = apps.map((app) => app.appName);

  if (appNames.includes(schema.app)) {
    throw new Error(`App ${schema.app} already exist!`);
  }

  const name = names(schema.app).fileName;

  const projectDirectory = schema.directory
    ? `${names(schema.directory).fileName}/${name}`
    : name;

  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');

  const projectRoot = normalizePath(
    `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`
  );

  const parsedTags = schema.tags
    ? schema.tags.split(',').map((s) => s.trim())
    : [];

  // ?
  const projectSourceRoot = joinPathFragments(projectRoot, 'src');

  const { overrideTargets } = schema;

  const tasks: GeneratorCallback[] = [];
  const initTask = await createNodeInitTask(host);

  tasks.push(initTask);

  const buildTargetName = overrideTargets ? 'build' : 'vite-build';
  const serveTargetName = overrideTargets ? 'serve' : 'vite-serve';
  const devTargetName = overrideTargets ? 'dev' : 'vite-dev';
  const infoTargetName = overrideTargets ? 'info' : 'vite-info';

  const vitepressDocRoot = joinPathFragments(projectRoot, 'docs');
  const vitepressOutput = joinPathFragments(
    vitepressDocRoot,
    '.vitepress',
    'dist'
  );

  const viteConfigPath = joinPathFragments(projectRoot, 'vite.config.ts');

  const project: ProjectConfiguration & NxJsonProjectConfiguration = {
    root: projectRoot,
    sourceRoot: projectSourceRoot,
    projectType: 'application',
    targets: {
      [buildTargetName]: {
        executor: 'nx-plugin-vitepress:build',
        outputs: [vitepressOutput],
        options: {
          root: vitepressDocRoot,
          outDir: 'dist',
          assetsDir: 'assets',
          write: true,
          manifest: false,
          brotliSize: true,
          watch: false,
        },
      },
      [serveTargetName]: {
        executor: 'nx-plugin-vitepress:serve',
        options: {
          root: vitepressDocRoot,
          port: 6789,
        },
      },
      [devTargetName]: {
        executor: 'nx-plugin-vitepress:dev',
        options: {
          root: vitepressDocRoot,
          port: 6789,
        },
      },
      [infoTargetName]: {
        executor: 'nx-plugin-vitepress:info',
        options: {
          root: projectRoot,
          buildTarget: buildTargetName,
          serveTarget: serveTargetName,
          devTarget: devTargetName,
        },
      },
    },
    tags: parsedTags,
  };

  // generate vp config ?
  generateFiles(host, path.join(__dirname, './files/base'), projectRoot, {
    tmpl: '',
    offset: offsetFromRoot(projectRoot),
    projectName,
  });

  generateFiles(host, path.join(__dirname, './files/base'), projectRoot, {
    tmpl: '',
    offset: offsetFromRoot(projectRoot),
    projectName,
  });

  generateFiles(
    host,
    path.join(__dirname, './files/extra/vitepress'),
    joinPathFragments(vitepressDocRoot, '.vitepress'),
    {
      tmpl: '',
    }
  );

  if (schema.generateViteConfig) {
    generateFiles(
      host,
      path.join(__dirname, './files/extra/vite'),
      projectRoot,
      {
        tmpl: '',
      }
    );
    project.targets[buildTargetName].options['viteConfigPath'] = viteConfigPath;
    project.targets[devTargetName].options['viteConfigPath'] = viteConfigPath;
  }

  // update git ignore >> /**/node_modules/.vite

  addProjectConfiguration(host, projectName, project);

  await formatFiles(host);

  addDependenciesToPackageJson(
    host,
    {
      vitepress: '^0.13.2',
    },
    {}
  );

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
