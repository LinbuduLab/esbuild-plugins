// init是只能对存在的app用吧？

export interface PrismaInitGeneratorSchema {
  app: string;

  // prisma/schema.prisma
  directory: string;
  schemaName: string;
  datasourceProvider: 'sqlite' | 'postgresql' | 'mysql' | 'sqlserver';
  datasourceUrl: string;
  // TODO: support file path
  clientProvider: 'prisma-client-js';
  watch: boolean;
  createEnvFile: boolean;
  // TODO:
  // binaryTargets
  // previewFeatures
}

export interface NormalizedPrismaInitGeneratorSchema
  extends PrismaInitGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;
  projectDirectory: string;
  offsetFromRoot: string;
}
