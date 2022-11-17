import path from 'path';

// parent: a/b
// child: a/b/c
// relativePath: c

// parent: a/b
// child: a/b/c/d
// relativePath: c\d

// parent: a/b
// child: a/c
// relativePath: ..\c

// parent: a/b
// child: c
// relativePath: ..\c

// parent: C://a/b
// child: C://a/b
// relativePath: ..\c

// parent: C://a
// child: A://a
// relativePath: A:\a ABS true

export const isInDirectory = (parent: string, child: string): boolean => {
  const relativePath = path.relative(parent, child);
  return !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
};

export const isInGitDirectory = (
  path: string,
  gitRootPath?: string
): boolean => {
  return gitRootPath === undefined || isInDirectory(gitRootPath, path);
};
