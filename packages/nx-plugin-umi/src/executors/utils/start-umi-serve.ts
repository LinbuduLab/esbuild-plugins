import execa from 'execa';
import { from } from 'rxjs';
import path from 'path';
import chalk from 'chalk';
import consola from 'consola';

// TODO: umi fork inspect utils
// TODO: execa options
// dev命令不需要使用修改的initWebpack
export const startUmiServe = (cwd: string) => {
  const forkedDevProcess = execa.node(
    require.resolve('umi/lib/forkedDev'),
    // 使用nx schema 来进行支持
    // ['-r', 'source-map-support/register', '--inspect-brk'],
    {
      cwd,
      stdio: 'inherit',
    }
  );

  const cwdPath = path.resolve(cwd);
  consola.info(`Using cwd path: ${chalk.cyan(cwdPath)}\n`);

  consola.info(
    `Load package.json from ${chalk.cyan(
      path.resolve(cwdPath, 'package.json')
    )}\n`
  );

  process.env.APP_ROOT = path.resolve(cwdPath, 'src');

  process.on('SIGINT', () => {
    forkedDevProcess.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    forkedDevProcess.kill('SIGTERM');
    process.exit(1);
  });

  forkedDevProcess.on('message', (msg) => {
    // console.log('msg: ', msg);
    // 难道环境变量还会被重写
    // console.log(
    //   chalk.cyan(`process.env.UMI_VERSION: ${process.env.UMI_VERSION}`)
    // );
    // console.log(chalk.cyan(`process.env.UMI_DIR: ${process.env.UMI_DIR}`));
  });

  return from(forkedDevProcess);
};
