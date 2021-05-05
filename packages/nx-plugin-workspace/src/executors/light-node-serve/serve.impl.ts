import { LightNodeServeExecutorSchema } from './schema';

export default async function runExecutor(
  options: LightNodeServeExecutorSchema,
) {
  console.log('Executor ran for LightNodeServe', options)
  return {
    success: true
  }
}

