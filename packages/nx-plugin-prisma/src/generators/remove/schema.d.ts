export interface PrismaRemoveGeneratorSchema {
  app: string;
  prismaDirectory: string;
  schemaName: string;
  clientOutput?: string;
}

export interface NormalizedPrismaRemoveGeneratorSchema
  extends PrismaRemoveGeneratorSchema {
  clientOutput: string;
}
