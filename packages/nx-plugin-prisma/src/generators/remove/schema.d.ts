export interface PrismaRemoveGeneratorSchema {
  app: string;
  prismaDirectory: string;
  schemaName: string;
}

export interface NormalizedPrismaRemoveGeneratorSchema
  extends PrismaRemoveGeneratorSchema {}
