import path from 'path';

export function createProductionConfiguration(projectSourceRoot: string) {
  return {
    fileReplacements: [
      {
        replace: `${projectSourceRoot}/environments/environment.ts`,
        with: `${projectSourceRoot}/environments/environment.prod.ts`,
      },
    ],
    aliases: [
      {
        from: './environments/environment',
        to: path.resolve(
          process.cwd(),
          projectSourceRoot,
          './environments/environment.prod.ts'
        ),
      },
    ],
    skipTypeCheck: false,
    sourceMap: 'both',
    bundle: true,
    externalDependencies: 'all',
    minify: true,
    extractLicenses: true,
  };
}
