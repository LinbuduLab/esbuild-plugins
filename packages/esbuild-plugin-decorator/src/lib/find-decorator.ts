import stripComments from 'strip-comments';

const DECORATOR_MATCHER = new RegExp(
  /((?<![(\s]\s*['"])@\w*[\w\d]\s*(?![;])[((?=\s)])/
);

export const findDecorators = (fileContent: string) =>
  fileContent ? DECORATOR_MATCHER.test(stripComments(fileContent)) : false;
