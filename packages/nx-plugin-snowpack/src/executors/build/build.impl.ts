import { BuildExecutorSchema } from './schema';
import { startServer, startDevServer, build } from 'snowpack';

export default async function runExecutor(options: BuildExecutorSchema) {
  console.log('Executor ran for Build', options);
  return {
    success: true,
  };
}
