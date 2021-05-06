import {
  Project,
  StructureKind,
  ExportDeclarationStructure,
  OptionalKind,
} from 'ts-morph';

const project = new Project();

const sourceFile = project.createSourceFile(path, content, {
  overwrite: true,
});

const exportDeclaration: OptionalKind<ExportDeclarationStructure> = {
  kind: StructureKind.ExportDeclaration,
  isTypeOnly: false,
  moduleSpecifier: `./${directory}/${fileName}`,
};

sourceFile.addExportDeclaration(exportDeclaration);

export function appendExportToIndexFile(
  path: string,
  content: string,
  directory: string,
  fileName: string
): string {
  const project = new Project();

  const sourceFile = project.createSourceFile(path, content, {
    overwrite: true,
  });

  const exportDeclaration: OptionalKind<ExportDeclarationStructure> = {
    kind: StructureKind.ExportDeclaration,
    isTypeOnly: false,
    moduleSpecifier: `./${directory}/${fileName}`,
  };

  sourceFile.addExportDeclaration(exportDeclaration);

  return sourceFile.getFullText();
}
