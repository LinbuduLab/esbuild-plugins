import type { Linter } from '@nrwl/linter';

type Tools =
  | 'Apollo-Server-Plugin'
  | 'Directives'
  | 'Extensions'
  | 'DataLoader'
  | 'GraphQL-Voyager'
  | 'PM2';

type Abilities =
  | 'GraphQL-Code-Generator'
  | 'GenQL'
  | 'Jest'
  | 'DataLoader'
  | 'GraphQL-Voyager'
  | 'PM2';

export interface TypeGraphQLApplicationSchema {
  app: string;
  directory: string;
  minimal: boolean;
  database: 'SQLite' | 'MySQL' | 'PostgreSQL';
  orm: 'TypeORM' | 'Prisma';
  server: 'Apollo-Server' | 'GraphQL-Yoga';
  tools: Tools[];
  ability: Abilities[];
  directory: string;
  frontendProject: string;
  tags: string;
}

export interface NormalizedTypeGraphQLResolverSchema
  extends TypeGraphQLApplicationSchema {
  name: string;
  appProjectRoot: string;
  parsedTags: string[];
  linter?: Linter.EsLint;
  unitTestRunner: 'jest';
}
