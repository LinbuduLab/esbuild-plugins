import path from 'path';

export type FileReplacement = {
  replace: string;
  with: string;
};

export function normalizeFileReplacements(
  projectRoot: string,
  fileReplacements: FileReplacement[]
): FileReplacement[] {
  return fileReplacements
    ? fileReplacements.map((fileReplacement) => ({
        replace: path.resolve(projectRoot, fileReplacement.replace),
        with: path.resolve(projectRoot, fileReplacement.with),
      }))
    : [];
}
