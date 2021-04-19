export type Insert = {
  banner: boolean;
  applyToJSFile: boolean;
  content: string;
};

export type InsertFileType = 'js' | 'css';

export interface FormattedInsert {
  banner: {
    [key in InsertFileType]?: string;
  };
  footer: {
    [key in InsertFileType]?: string;
  };
}
