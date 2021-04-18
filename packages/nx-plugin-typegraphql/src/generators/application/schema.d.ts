import type {
  BasicNodeAppGenSchema,
  BasicNormalizedAppGenSchema,
} from 'nx-plugin-devkit';

type Tools =
  | 'Apollo-Server-Plugin'
  | 'GraphQL-Tools'
  | 'GraphQL-Extensions'
  | 'DataLoader'
  | 'GraphQL-Voyager'
  | 'GenQL'
  | 'GraphQL-Doc'
  | 'PM2';

export interface TypeGraphQLApplicationExtraSchema {
  database: 'SQLite' | 'MySQL' | 'PostgreSQL' | 'none';
  orm: 'TypeORM' | 'Prisma' | 'none';
  server: 'Apollo-Server' | 'Express-GraphQL';
  tools: Tools[];
}

export interface TypeGraphQLApplicationSchema
  extends BasicNodeAppGenSchema,
    Partial<TypeGraphQLApplicationExtraSchema> {}

export interface NormalizedTypeGraphQLApplicationSchema
  extends BasicNormalizedAppGenSchema,
    Required<TypeGraphQLApplicationExtraSchema> {}
