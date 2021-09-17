export interface BasicAppGenSchema {
  app: string;
  directory?: string;
  tags?: string;
}

export interface BasicNodeAppGenSchema extends BasicAppGenSchema {
  minimal?: boolean;
  frontendProject?: string;
}

export interface BasicNormalizedAppGenSchema {
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;
  projectDirectory: string;

  /**
   * Node project only
   */
  frontendProject?: string;

  parsedTags: string[];
  offsetFromRoot: string;
}
