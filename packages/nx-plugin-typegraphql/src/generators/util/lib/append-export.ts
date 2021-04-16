import {
  Project,
  StructureKind,
  ExportDeclarationStructure,
  OptionalKind,
} from 'ts-morph';

export function appendExportToIndexFile(
  path: string,
  content: string,
  exportFrom: string,
  fileName: string
): string {
  const project = new Project();

  const sourceFile = project.createSourceFile(path, content, {
    overwrite: true,
  });

  // export * from "./directives/x"
  const exportDeclaration: OptionalKind<ExportDeclarationStructure> = {
    kind: StructureKind.ExportDeclaration,
    isTypeOnly: false,
    moduleSpecifier: `./${exportFrom}/${fileName}`,
  };

  sourceFile.addExportDeclaration(exportDeclaration);

  return sourceFile.getFullText();
}
