export interface GenExecutorSchema {} // eslint-disable-line

export interface TypeGraphQLGeneratorSchema {
  failFast?: boolean;

  genql?: boolean;
  codeGen?: boolean;
  docGen?: boolean;

  genqlOutput?: string;
  codeGenOutput?: string;
  codeGenSchemaOutput?: string | boolean;
  docGenOutput?: string;

  updateGitIgnore?: boolean;

  // public
  schema?: string;
  // Does genql support url ?
  endpoint?: string;

  // code gen options
  // support in the future
  // useApolloClientPlugin?: boolean;
  // useTimePlugin?: boolean;
  // useAppendPlugin?: string;
  // TODO: support all code-gen options

  // genql options

  // docs options
}

export interface NormalizedGeneratorSchema
  extends Required<TypeGraphQLGeneratorSchema> {
  __todo__: string;
}
