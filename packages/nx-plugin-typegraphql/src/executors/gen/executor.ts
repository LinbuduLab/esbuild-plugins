import { GenExecutorSchema } from './schema';

export default async function runExecutor(
  options: GenExecutorSchema,
) {
  console.log('Executor ran for Gen', options)
  return {
    success: true
  }
}

