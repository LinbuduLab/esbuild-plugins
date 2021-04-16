import { NormalizedTypeGraphQLUtilSchema } from '../schema';

export function composeDepsList(
  schema: NormalizedTypeGraphQLUtilSchema
): Record<string, string> {
  let basic: Record<string, string> = {
    'type-graphql': 'latest',
    graphql: 'latest',
    'reflect-metadata': 'latest',
  };

  switch (schema.type) {
    case 'Directive':
      basic = {
        ...basic,
        'graphql-tools': 'latest',
      };
      break;
    case 'Decorator':
      break;
    case 'Plugin':
      basic = {
        ...basic,
        ['apollo-server-core']: 'latest',
        ['apollo-server-plugin-base']: 'latest',
      };
      break;
    case 'Extension':
      basic = {
        ...basic,
        ['graphql-extensions']: 'latest',
        ['apollo-server-plugin-base']: 'latest',
      };
      break;
    default:
      break;
  }

  return basic;
}

export function composeDevDepsList(
  schema: NormalizedTypeGraphQLUtilSchema
): Record<string, string> {
  let basic: Record<string, string> = {};

  switch (schema.type) {
    case 'Plugin':
      basic = {
        ...basic,
        ['apollo-server-core']: 'latest',
        ['apollo-server-plugin-base']: 'latest',
      };
      break;
    case 'Directive':
    case 'Decorator':
    case 'Extension':
      break;
    default:
      break;
  }

  return basic;
}
