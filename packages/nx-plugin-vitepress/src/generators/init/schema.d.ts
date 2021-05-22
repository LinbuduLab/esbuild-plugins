export interface BaseSchema {
  app: string;
  directory?: string;
  tags?: string;
}

export interface InitSchema extends BaseSchema {
  generateViteConfig: boolean;
  generateConfig: boolean;
  overrideTargets: boolean;
  setupLint: boolean;
}

export interface NormalizedInitSchema extends InitSchema {
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;
  projectDirectory: string;

  parsedTags: string[];
  offsetFromRoot: string;
}
