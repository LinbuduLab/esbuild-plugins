import { StartExecutorSchema } from './schema';

export default async function runExecutor(
  options: StartExecutorSchema,
) {
  console.log('Executor ran for Start', options)
  return {
    success: true
  }
}

