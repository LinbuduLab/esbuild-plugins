import { PreviewExecutorSchema } from './schema';

export default async function runExecutor(
  options: PreviewExecutorSchema,
) {
  console.log('Executor ran for Preview', options)
  return {
    success: true
  }
}

