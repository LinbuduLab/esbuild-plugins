import { TypeGraphQLMiddlewareSchema } from '../schema';

export function composeDepsList(
  schema: TypeGraphQLMiddlewareSchema
): Record<string, string> {
  const basic: Record<string, string> = {
    'type-graphql': 'latest',
    graphql: 'latest',
    'reflect-metadata': 'latest',
    [schema.diLibs === 'TypeDI' ? 'typedi' : 'inversify']: 'latest',
  };

  return basic;
}

export function composeDevDepsList(
  schema: TypeGraphQLMiddlewareSchema
): Record<string, string> {
  const basic = {};

  return basic;
}
