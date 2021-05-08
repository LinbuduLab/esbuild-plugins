import { BuildExecutorSchema } from './schema';
import { join } from 'path';
import { chalk, yParser } from '@umijs/utils';
import { existsSync } from 'fs';
import { Service } from 'umi/lib/ServiceWithBuiltIn';
import fork from 'umi/lib/utils/fork';
import getCwd from 'umi/lib/utils/getCwd';
import getPkg from 'umi/lib/utils/getPkg';
import initWebpack from 'umi/lib/initWebpack';

export default function runExecutor(options: BuildExecutorSchema) {
  // 有无现成的ChildProcess转Promise？
  const child = fork({
    scriptPath: require.resolve('umi/lib/forkedDev'),
  });
  process.on('SIGINT', () => {
    child.kill('SIGINT');
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
    process.exit(1);
  });
  return {
    success: true,
  };
}
