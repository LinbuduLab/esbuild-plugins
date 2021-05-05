import { BuildExecutorSchema } from './schema';
import {} from 'parcel-bundler';
import parcel from 'parcel';

export default async function runExecutor(options: BuildExecutorSchema) {
  console.log('Executor ran for Build', options);
  return {
    success: true,
  };
}
