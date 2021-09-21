import { TscExecutorSchema } from './schema';

// Initial: execute `tsc` under project root
export default async function runExecutor(options: TscExecutorSchema) {
  console.log('Executor ran for Tsc', options);
  return {
    success: true,
  };
}
