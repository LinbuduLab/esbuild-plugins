export interface ResolverGeneratorSchema {
  name: string;
  tags?: string;
  directory?: string;
}

export interface TypeGraphQLResolverSchema {
  resolverName: string;
  fullImport: boolean;
  fieldResolver: boolean;
  appOrLibName: string;
  directory: string;
}
