export interface KoaAppGeneratorSchema {
  app: string;
  directory?: string;
  tags?: string;
  frontendProject?: string;

  // extra
  minimal?: boolean;
  routingControllerBased?: boolean;
  router?: boolean;
}

export interface NormalizedKoaAppGeneratorSchema extends KoaAppGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  offsetFromRoot: string;
}
