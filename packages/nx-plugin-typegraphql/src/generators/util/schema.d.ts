export interface UtilGeneratorSchema {
  name: string;
  tags?: string;
  directory?: string;
}

type UtilType =
  | 'Directive'
  | 'Scalar'
  | 'Apollo Plugin'
  | 'Extension'
  | 'Decorator';

export interface TypeGraphQLUtilSchema {
  name: string;
  type: UtilType;
  appOrLibName: string;
  directory?: string;
}

export interface NormalizedTypeGraphQLUtilSchema extends TypeGraphQLUtilSchema {
  projectRoot: string;
  generateAtApp: boolean;
  generateDirectory: string;
}
