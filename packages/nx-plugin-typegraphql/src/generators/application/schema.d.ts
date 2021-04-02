export interface ApplicationGeneratorSchema {
  name: string;
  tags?: string;
  directory?: string;
}

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
  parsedTags: string[];
  appProjectRoot: string;
}
