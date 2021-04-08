import stripComments from 'strip-comments';

const theFinder = new RegExp(
  /((?<![(\s]\s*['"])@\w*[\w\d]\s*(?![;])[((?=\s)])/
);

export const findDecorators = (fileContent: string) =>
  fileContent ? theFinder.test(stripComments(fileContent)) : false;
