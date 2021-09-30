import {
  formatFiles,
  Tree,
  updateProjectConfiguration,
  readProjectConfiguration,
  normalizePath,
} from '@nrwl/devkit';
import { getAvailableApps } from 'nx-plugin-devkit';
import { WorkspaceSetupGeneratorSchema } from './schema';
import { setupTargets } from './lib/targets';

export default async function (
  host: Tree,
  options: WorkspaceSetupGeneratorSchema
) {
  const apps = getAvailableApps(host);
  const appNames = apps.map((app) => app.appName);

  if (!appNames.includes(options.app)) {
    throw new Error(`App ${options.app} does not exist!`);
  }

  const originProjectConfiguration = readProjectConfiguration(
    host,
    options.app
  );

  const targets = setupTargets(
    options,
    options.app,
    normalizePath(originProjectConfiguration.root),
    normalizePath(originProjectConfiguration.sourceRoot)
  );

  // TODO:
  const { build, serve, dev, exec } = targets;

  // not use merge here, because we want to override origin targets entirely
  const updatedTargets = {
    ...originProjectConfiguration.targets,
    build,
    serve,
    dev,
    exec,
  };

  originProjectConfiguration.targets = updatedTargets;

  updateProjectConfiguration(host, options.app, originProjectConfiguration);

  await formatFiles(host);
}
