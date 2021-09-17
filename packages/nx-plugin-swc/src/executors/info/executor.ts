import { InfoExecutorSchema } from './schema';

export default async function runExecutor(
  options: InfoExecutorSchema,
) {
  console.log('Executor ran for Info', options)
  return {
    success: true
  }
}

