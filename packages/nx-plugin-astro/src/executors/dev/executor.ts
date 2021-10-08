import { DevExecutorSchema } from './schema';

export default async function runExecutor(
  options: DevExecutorSchema,
) {
  console.log('Executor ran for Dev', options)
  return {
    success: true
  }
}

