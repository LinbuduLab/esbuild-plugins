import { NodePackageExecutorSchema } from './schema';

export default async function runExecutor(
  options: NodePackageExecutorSchema,
) {
  console.log('Executor ran for NodePackage', options)
  return {
    success: true
  }
}

