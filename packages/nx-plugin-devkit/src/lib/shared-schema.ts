export interface BasicAppGenSchema {
  app: string;
  directory?: string;
  tags?: string;
  frontendProject?: string;
}

export interface BasicNodeAppGenSchema extends BasicAppGenSchema {
  minimal?: boolean;
}

export interface BasicNormalizedAppGenSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;

  frontendProject: string | undefined;

  parsedTags: string[];
  offsetFromRoot: string;
}
