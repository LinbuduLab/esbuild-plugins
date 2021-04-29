import path from 'path';
import fs from 'fs-extra';
import { Project, InterfaceDeclaration, TypeAliasDeclaration } from 'ts-morph';

export type ImportType = {
  typeImports: string[];
  commonImports: string[];
};

async function main() {
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

  const TYPE_ALIAS_DECLARATION = 'TypeAliasDeclaration';
  const INTERFACE_DECLARATION = 'InterfaceDeclaration';

  // TODO: 跳过原本就已经是import type的
  const import2ConvertAsType: string[] = [];

  // key: import from
  // value: type imports
  const import2ConvertAsTypeMap: Record<string, ImportType> = {};

  sourceFile.getImportDeclarations().forEach((declaration) => {
    if (!declaration.isModuleSpecifierRelative()) {
      return;
    }
    // @ts-ignore
    const importFrom: string = declaration.getModuleSpecifierValue();
    // "some-module"
    // skip "./some-module" for now
    // 好像反了。。只能处理相对导入。。
    // 绝对导入可能要require.resolve那一套？
    // console.log('importFrom: ', importFrom);
    // 浏览器
    // console.log(declaration.getImportClause().isTypeOnly());
    // 不同类型的import都需要处理
    // import {AAA}
    // import {AAA as BBB} 这种替换为 import type {AAA as BBB} 即可？
    // 不会处理import AAA 与 import * as AAA
    // 收集到imports如何查看这一import是type？

    const importClause = declaration.getImportClause();

    const imports = importClause.getNamedImports();

    const importSource = declaration
      .getModuleSpecifierSourceFile()
      .getExportedDeclarations();

    const importsText = imports.map((importSpecifier) =>
      importSpecifier.getText()
    );

    for (const item of Array.from(importSource.keys())) {
      const exportDeclaration = importSource.get(item);
      const kindName = exportDeclaration[0].getKindName();
      if (importsText.includes(item)) {
        if (
          kindName === TYPE_ALIAS_DECLARATION ||
          kindName === INTERFACE_DECLARATION
        ) {
          import2ConvertAsType.push(item);
          import2ConvertAsTypeMap[importFrom] = {
            typeImports: [
              ...(import2ConvertAsTypeMap[importFrom]?.typeImports ?? []),
              item,
            ],
            commonImports:
              import2ConvertAsTypeMap[importFrom]?.commonImports ?? [],
          };
        } else {
          import2ConvertAsTypeMap[importFrom] = {
            commonImports: [
              ...(import2ConvertAsTypeMap[importFrom]?.commonImports ?? []),
              item,
            ],
            typeImports: import2ConvertAsTypeMap[importFrom]?.typeImports ?? [],
          };
        }
      }
    }
  });

  console.log('import2ConvertAsType: ', import2ConvertAsType);
  console.log('import2ConvertAsTypeMap: ', import2ConvertAsTypeMap);

  const tmp: Record<string, ImportType> = {};

  for (const [k, v] of Object.entries(import2ConvertAsTypeMap)) {
    if (v.typeImports.length) {
      tmp[k] = v;
    }
  }
  console.log('tmp: ', tmp);

  sourceFile.getImportDeclarations().forEach((declaration) => {
    // @ts-ignore
    const importFrom: string = declaration.getModuleSpecifierValue();
    if (
      !(
        declaration.isModuleSpecifierRelative() &&
        Object.keys(tmp).includes(importFrom)
      )
    ) {
      return;
    }

    // 移除原本的import

    // 尝试中
    declaration.remove();
  });

  for (const [record, imports] of Object.entries(tmp)) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: record,
      namedImports: imports.typeImports,
      isTypeOnly: true,
    });

    if (imports.commonImports.length) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: record,
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

main();
