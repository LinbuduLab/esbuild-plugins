export interface ResolverGeneratorSchema {
  name: string;
  tags?: string;
  directory?: string;
}

export interface TypeGraphQLGeneratorSchema {
  resolverName: string;
  fullImport: boolean;
  fieldResolver: boolean;
}
