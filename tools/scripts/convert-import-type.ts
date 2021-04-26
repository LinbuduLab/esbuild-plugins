import path from 'path';
import fs from 'fs-extra';
import { Project } from 'ts-morph';

async function main() {
  const projectPath = path.join(
    process.cwd(),
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

  // [importFrom]: ["importA", "importB"]
  // 遍历所有import
  //
  const importMap: Record<string, string[]> = {};

  sourceFile.getImportDeclarations().forEach((declaration) => {
    // @ts-ignore
    const importFrom: string = declaration.getModuleSpecifierValue();
    // console.log(importFrom);
    // 浏览器
    // console.log(declaration.getImportClause().isTypeOnly());
    // 不同类型的import都需要处理
    // import {AAA}
    // import {AAA as BBB} 这种替换为 import type {AAA as BBB} 即可？
    // 不会处理import AAA 与 import * as AAA
    // 收集到imports如何查看这一import是type？
    const importClause = declaration.getImportClause();

    const imports = importClause.getNamedImports();

    // import * as
    // const imports = importClause.getNamespaceImport();

    // console.log(imports?.getFullText());
    const importsText = imports.map((importSpecifier) =>
      importSpecifier.getText()
    );

    // if (importsText.length) {
    //   importMap[importFrom] = importsText;
    // }

    const tmp = importsText[0];
  });

  console.log('importMap: ', importMap);
}

main();
