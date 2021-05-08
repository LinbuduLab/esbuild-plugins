import { ReactScriptsExecutorSchema } from './schema';

export default async function runExecutor(
  options: ReactScriptsExecutorSchema,
) {
  console.log('Executor ran for ReactScripts', options)
  return {
    success: true
  }
}

