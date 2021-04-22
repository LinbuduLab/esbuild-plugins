export interface TypeGraphQLGenSchema {
  app: string;

  failFast: boolean;

  genql: boolean;
  code: boolean;
  docs: boolean;

  // public
  schema: string;
  // Does genql support url ?
  // endpoint?: string;

  // genqlOutput?: string;
  // codeGenOutput?: string;
  // codeGenSchemaOutput?: string | boolean;
  // docGenOutput?: string;

  // updateGitIgnore?: boolean;

  // code gen options
  // support in the future
  // useApolloClientPlugin?: boolean;
  // useTimePlugin?: boolean;
  // useAppendPlugin?: string;
  // TODO: support all code-gen options

  // genql options

  // docs options
}

export interface NormalizedGenSchema extends Required<TypeGraphQLGenSchema> {
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;

  offsetFromRoot: string;
}
