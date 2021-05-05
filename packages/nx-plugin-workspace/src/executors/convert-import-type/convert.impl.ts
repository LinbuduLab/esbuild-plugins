import { ConvertImportTypeExecutorSchema } from './schema';

export default async function runExecutor(
  options: ConvertImportTypeExecutorSchema
) {
  console.log('Executor ran for ConvertImportType', options);
  return {
    success: true,
  };
}
