import { ExecutorContext } from '@nrwl/devkit';
import { PrismaInfoExecutorSchema } from './schema';
import { envInfo } from 'nx-plugin-devkit';
import { reportHandler } from 'nx/src/command-line/report';
import execa from 'execa';
import npmRunPath from 'npm-run-path';

export default async function infoExecutor(
  rawOptions: PrismaInfoExecutorSchema,
  context: ExecutorContext
) {
  const {
    sourceRoot: projectSourceRoot,
    root: projectRoot,
    targets: projectTargets,
  } = context.workspace.projects[context.projectName];

  if (!projectSourceRoot) {
    throw new Error(`${context.projectName} does not have a sourceRoot.`);
  }

  if (!projectRoot) {
    throw new Error(`${context.projectName} does not have a root.`);
  }

  const { stdout } = await execa('prisma', ['-v'], {
    stdio: 'pipe',
    env: npmRunPath.env(),
  });

  console.log(stdout);

  reportHandler();

  const envInfos = await envInfo([
    'prisma',
    '@prisma/client',
    'nx-plugin-devkit',
    'nx-plugin-workspace',
  ]);

  console.log(envInfos);

  return {
    success: true,
  };
}
