import { names } from '@nrwl/devkit';

import {
  Project,
  StructureKind,
  ExportDeclarationStructure,
  OptionalKind,
} from 'ts-morph';

export function appendExportToIndexFile(
  path: string,
  content: string,
  fileName: string,
  namespace?: string,
  exportFrom?: string
): string {
  const project = new Project();
  let formattedNamespace = '';

  const sourceFile = project.createSourceFile(path, content, {
    overwrite: true,
  });

  const { className } = names(namespace);

  if (
    className.toLocaleUpperCase().indexOf('OBJECT') === -1 &&
    className.toLocaleUpperCase().indexOf('OBJECTTYPE') === -1 &&
    className.toLocaleUpperCase().indexOf('TYPE') === -1
  ) {
    formattedNamespace = `${className}Type`;
  } else {
    formattedNamespace = className;
  }

  const exportDeclaration: OptionalKind<ExportDeclarationStructure> = {
    kind: StructureKind.ExportDeclaration,
    isTypeOnly: false,
    moduleSpecifier: exportFrom
      ? `./${exportFrom}/${fileName}`
      : `./lib/${fileName}`,
  };

  if (namespace) {
    exportDeclaration.namespaceExport = formattedNamespace;
  }

  sourceFile.addExportDeclaration(exportDeclaration);

  return sourceFile.getFullText();
}
