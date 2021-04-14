export type UtilType =
  | 'Directive'
  | 'Scalar'
  | 'Plugin'
  | 'Extension'
  | 'Decorator';

export enum UtilTypeEnum {
  Directive = 'Directive',
  Scalar = 'Scalar',
  Plugin = 'Plugin',
  Extension = 'Extension',
  Decorator = 'Decorator',
}

export interface TypeGraphQLUtilSchema {
  name: string;
  type: UtilType;
  appOrLib: string;
  directory?: string;
}

export interface NormalizedTypeGraphQLUtilSchema extends TypeGraphQLUtilSchema {
  projectSourceRoot: string;
  generateAtApp: boolean;
  generateDirectory: string;
}
