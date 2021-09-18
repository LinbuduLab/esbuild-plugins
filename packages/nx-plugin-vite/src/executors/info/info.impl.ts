import { ExecutorContext, parseTargetString } from '@nrwl/devkit';
import { ViteInfoSchema } from './schema';
import { nxReportHandler, envInfo } from 'nx-plugin-devkit';
import execa from 'execa';
import npmRunPath from 'npm-run-path';

// 默认target
// vite-serve
// vite-build

export default async function runExecutor(
  rawOptions: ViteInfoSchema,
  context: ExecutorContext
) {
  const { targets } = context.workspace.projects[context.projectName];
  const projectTargets = Object.keys(targets);
  const {
    buildTarget = `${context.projectName}:vite-build`,
    serveTarget = `${context.projectName}:vite-serve`,
  } = rawOptions;

  const buildTargetName = parseTargetString(buildTarget).target;
  const serveTargetName = parseTargetString(serveTarget).target;

  if (!projectTargets.includes(buildTargetName)) {
    throw new Error(
      `Build target ${buildTargetName} does not exist in targets of ${context.projectName}`
    );
  }

  if (!projectTargets.includes(serveTargetName)) {
    throw new Error(
      `Serve target ${buildTargetName} does not exist in targets of ${context.projectName}`
    );
  }

  console.log(`Project build target: ${rawOptions.buildTarget}`);
  console.log(`Project serve target: ${rawOptions.serveTarget}`);

  nxReportHandler();

  const { stdout } = await execa('vite', ['-v'], {
    stdio: 'pipe',
    env: npmRunPath.env(),
  });

  console.log(stdout);

  const envInfos = await envInfo([
    'nx-plugin-vite',
    'nx-plugin-devkit',
    'nx-plugin-workspace',
    'vite',
  ]);

  console.log(envInfos);

  return {
    success: true,
  };
}
