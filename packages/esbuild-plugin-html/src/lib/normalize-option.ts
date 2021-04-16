export interface Option {
  title?: string;
  templatePath?: string;
  fileName?: string;
  inject?: boolean | 'head' | 'body';
  scriptLoading?: 'blocking' | 'defer';
  favicon?: string;
  meta?: Record<string, string>;
}
