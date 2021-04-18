export interface BasicAppGenSchema {
  app: string;
  directory?: string;
  tags?: string;
}

export interface BasicNodeAppGenSchema extends BasicAppGenSchema {
  // frontendProject?: string;
  minimal?: boolean;
}

export interface BasicNormalizedAppGenSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;

  parsedTags: string[];
  offsetFromRoot: string;
}
