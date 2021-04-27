import { StudioExecutorSchema } from './schema';

export default async function runExecutor(
  options: StudioExecutorSchema,
) {
  console.log('Executor ran for Studio', options)
  return {
    success: true
  }
}

