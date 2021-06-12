import {
  Project,
  StructureKind,
  ExportDeclarationStructure,
  OptionalKind,
} from 'ts-morph';

export function appendExportToIndexFile(
  path: string,
  content: string,
  fileName: string
): string {
  const project = new Project();

  const sourceFile = project.createSourceFile(path, content, {
    overwrite: true,
  });

  const exportDeclaration: OptionalKind<ExportDeclarationStructure> = {
    kind: StructureKind.ExportDeclaration,
    namedExports: ['default'],
    isTypeOnly: false,
    moduleSpecifier: `./lib/${fileName}`,
  };

  sourceFile.addExportDeclaration(exportDeclaration);

  return sourceFile.getFullText();
}
