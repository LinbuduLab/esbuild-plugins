import fs from 'fs-extra';
import path from 'path';

export interface Option {
  title?: string;
  templatePath?: string;
  fileName?: string;
  inject?: boolean | 'head' | 'body';
  scriptLoading?: 'blocking' | 'defer';
  favicon?: string;
  meta?: Record<string, string>;
}

export type NormalizedOption = Required<Option>;

export function normalizeOption(options: Option): NormalizedOption {
  const normalizedOption: NormalizedOption = {
    title: 'ESBuild App',
    templatePath: './src/index.html',
    fileName: 'index.html',
    inject: 'body',
    scriptLoading: 'blocking',
    favicon: './src/assets/favicon.ico',
    meta: {},
    ...options,
  };

  const templateExists = fs.existsSync(
    path.join(__dirname, normalizedOption.templatePath)
  );

  return normalizedOption;
}
