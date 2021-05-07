import { FromSchema } from 'json-schema-to-ts';
import fs from 'fs-extra';
import {} from 'ts-morph';
import path from 'path';

// 选择package
// 选择具体的executor/generator
// 生成到lib/types.ts or schema.d.ts
// 是否覆盖原有的文件内容

//

async function main() {
  const TMP_PATH = path.join(
    process.cwd(),
    'packages',
    'nx-plugin-parcel',
    'src/executors/build/schema.json'
  );

  const jsonContent = fs.readFileSync(TMP_PATH, 'utf8');
  const jsonSchemeObj = JSON.parse(jsonContent);

  delete jsonSchemeObj['$schema'];
  delete jsonSchemeObj['cli'];
  delete jsonSchemeObj['title'];
  delete jsonSchemeObj['description'];
  delete jsonSchemeObj['required'];

  type InferredType = FromSchema<typeof jsonSchemeObj>;
}

main();
