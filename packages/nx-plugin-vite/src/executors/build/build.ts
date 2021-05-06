import { BuildExecutorSchema } from './schema';
import { build } from 'vite';

export default async function runExecutor(options: BuildExecutorSchema) {
  console.log('Executor ran for Build', options);
  return {
    success: true,
  };
}
