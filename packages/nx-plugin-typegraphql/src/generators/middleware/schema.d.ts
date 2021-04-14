export interface TypeGraphQLMiddlewareSchema {
  middlewareName: string;
  appsOrLibs: string;
  directory: string;
  useFunctional: boolean;
  asDIProvider: boolean;
  diLibs: 'TypeDI' | 'Inversify';
}

export interface MiddlewareGeneratorSchema {
  name: string;
  tags?: string;
  directory?: string;
}
