import type { Linter } from '@nrwl/linter';

type Tools =
  | 'Apollo-Server-Plugin'
  | 'GraphQL-Tools'
  | 'GraphQL-Extensions'
  | 'DataLoader'
  | 'GraphQL-Voyager'
  | 'GenQL'
  | 'GraphQL-Doc'
  | 'PM2';

export interface TypeGraphQLApplicationSchema {
  app: string;
  directory: string;
  minimal: boolean;
  database: 'SQLite' | 'MySQL' | 'PostgreSQL' | 'none';
  orm: 'TypeORM' | 'Prisma' | 'none';
  server: 'Apollo-Server' | 'Express-GraphQL';
  tools: Tools[];
  directory: string;
  // frontendProject: string;
  tags: string;
}

export interface NormalizedTypeGraphQLResolverSchema
  extends TypeGraphQLApplicationSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  offsetFromRoot: string;
}
