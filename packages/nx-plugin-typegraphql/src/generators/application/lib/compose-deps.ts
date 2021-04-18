import { NormalizedTypeGraphQLApplicationSchema } from '../schema';

export function composeDepsList(
  schema: NormalizedTypeGraphQLApplicationSchema
): Record<string, string> {
  const basic: Record<string, string> = {
    'type-graphql': 'latest',
    graphql: 'latest',
    'reflect-metadata': 'latest',
    'apollo-server-koa': 'latest',
    koa: 'latest',
  };

  return basic;
}

export function composeDevDepsList(
  schema: NormalizedTypeGraphQLApplicationSchema
): Record<string, string> {
  const basic = {
    chalk: 'latest',
    'source-map-support': 'latest',
  };

  return basic;
}
