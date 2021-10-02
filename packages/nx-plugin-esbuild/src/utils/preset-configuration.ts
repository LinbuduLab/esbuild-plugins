export function createProductionConfiguration(projectSourceRoot: string) {
  return {
    fileReplacements: [
      {
        replace: `${projectSourceRoot}/environments/environment.ts`,
        with: `${projectSourceRoot}/environments/environment.prod.ts`,
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
