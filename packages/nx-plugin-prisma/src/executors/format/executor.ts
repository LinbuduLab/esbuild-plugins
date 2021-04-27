import { FormatExecutorSchema } from './schema';

export default async function runExecutor(options: FormatExecutorSchema) {
  console.log('Executor ran for Format', options);
  return {
    success: true,
  };
}
