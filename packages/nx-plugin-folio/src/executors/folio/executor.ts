import { FolioExecutorSchema } from './schema';

export default async function runExecutor(
  options: FolioExecutorSchema,
) {
  console.log('Executor ran for Folio', options)
  return {
    success: true
  }
}

