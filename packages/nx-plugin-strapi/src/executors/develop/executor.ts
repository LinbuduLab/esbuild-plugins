import { DevelopExecutorSchema } from './schema';

export default async function runExecutor(
  options: DevelopExecutorSchema,
) {
  console.log('Executor ran for Develop', options)
  return {
    success: true
  }
}

