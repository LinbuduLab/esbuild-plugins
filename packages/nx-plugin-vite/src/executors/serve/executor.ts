import { ServeExecutorSchema } from './schema';

export default async function runExecutor(options: ServeExecutorSchema) {
  console.log('Executor ran for Serve', options);
  return {
    success: true,
  };
}
