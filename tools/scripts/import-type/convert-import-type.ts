import path from 'path';
import fs from 'fs-extra';
import { Project } from 'ts-morph';

export type ImportType = {
  typeImports: string[];
  commonImports: string[];
};

const TYPE_ALIAS_DECLARATION = 'TypeAliasDeclaration';
const INTERFACE_DECLARATION = 'InterfaceDeclaration';

const isTypeExport = (kindName: string): boolean =>
  kindName === TYPE_ALIAS_DECLARATION || kindName === INTERFACE_DECLARATION;

// merge import methods may have different logics
const mergeTypeImports = (
  importsMap: Record<string, ImportType>,
  importFrom: string,
  exportItem: string
): void => {
  importsMap[importFrom] = {
    typeImports: [...(importsMap[importFrom]?.typeImports ?? []), exportItem],
    commonImports: importsMap[importFrom]?.commonImports ?? [],
  };
};

const mergeCommonImports = (
  importsMap: Record<string, ImportType>,
  importFrom: string,
  exportItem: string
): void => {
  importsMap[importFrom] = {
    typeImports: importsMap[importFrom]?.typeImports ?? [],
    commonImports: [
      ...(importsMap[importFrom]?.commonImports ?? []),
      exportItem,
    ],
  };
};

export async function main() {
  const projectPath = path.join(
    process.cwd(),
    // '../../',
    'packages',
    './nx-plugin-esbuild'
  );

  const filePath = path.join(projectPath, '/src/executors/build/build.impl.ts');

  const fileContent = fs.readFileSync(filePath, 'utf8');

  const morphProject = new Project({
    tsConfigFilePath: path.join(projectPath, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  });

  const sourceFile = morphProject.createSourceFile(filePath, fileContent, {
    overwrite: true,
  });

  // TODO: import alias
  // key: import from
  // value: type imports
  const fullImportsMap: Record<string, ImportType> = {};

  sourceFile.getImportDeclarations().forEach((declaration) => {
    // skip absoule import and exist type imports
    // import xxx from "some-module"
    // import type { A } from "some-module"
    if (!declaration.isModuleSpecifierRelative() || declaration.isTypeOnly()) {
      return;
    }
    // @ts-ignore
    const importFrom: string = declaration.getModuleSpecifierValue();
    // 不同类型的import都需要处理
    // import {AAA
    // import {AAA as BBB} 这种替换为 import type {AAA as BBB} 即可？
    // 不会处理import AAA 与 import * as AAA
    // 收集到imports如何查看这一import是type？

    const importClause = declaration.getImportClause();

    // 包括普通导入与别名导入，别名导入getText会直接是A as B的形式
    const imports = importClause.getNamedImports();

    const importsText = imports.map((importSpecifier) =>
      importSpecifier.getText()
    );
    // .map((specifier) => {});

    console.log('importsText: ', importsText);

    // 获取源文件的所有导出
    // Map<导出名，导出对象数组>
    const importSourceExports = declaration
      .getModuleSpecifierSourceFile()
      .getExportedDeclarations();

    for (const exportItem of Array.from(importSourceExports.keys())) {
      const exportDeclaration = importSourceExports.get(exportItem);
      // TODO: 这个数组还会包含啥成员？
      const kindName = exportDeclaration[0].getKindName();
      // 如果当前的导出存在于要进行处理的imports中，才进行处理
      if (importsText.includes(exportItem)) {
        // add imports to dirrerent maps
        isTypeExport(kindName)
          ? mergeTypeImports(fullImportsMap, importFrom, exportItem)
          : mergeCommonImports(fullImportsMap, importFrom, exportItem);
      }
    }
  });

  // 所有相对导入及其类型导入、普通导入
  console.log('fullImportsMap: ', fullImportsMap);

  // 存在类型导入的相对导入
  const typeImportsOnlyMap: Record<string, ImportType> = {};

  for (const [k, v] of Object.entries(fullImportsMap)) {
    if (v.typeImports.length) {
      typeImportsOnlyMap[k] = v;
    }
  }
  console.log('typeImportsOnlyMap: ', typeImportsOnlyMap);

  // 再次遍历所有导入，移除typeImportsOnlyMap中的导入
  sourceFile.getImportDeclarations().forEach((declaration) => {
    // @ts-ignore
    const importFrom: string = declaration.getModuleSpecifierValue();
    if (
      !(
        declaration.isModuleSpecifierRelative() &&
        Object.keys(typeImportsOnlyMap).includes(importFrom)
      )
    ) {
      return;
    }

    // 移除原本的import
    // 在后面再分成不同的形式加回去
    declaration.remove();
  });

  for (const [specifier, imports] of Object.entries(typeImportsOnlyMap)) {
    // 以import type新建导入
    sourceFile.addImportDeclaration({
      moduleSpecifier: specifier,
      namedImports: imports.typeImports,
      isTypeOnly: true,
    });

    // 新建普通导入
    if (imports.commonImports.length) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: specifier,
        namedImports: imports.commonImports,
        isTypeOnly: false,
      });
    }
  }

  fs.writeFileSync(
    path.join(projectPath, '/src/executors/build/xxx.ts'),
    sourceFile.getFullText()
  );
}
