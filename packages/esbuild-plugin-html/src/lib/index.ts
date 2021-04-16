import type { Plugin } from 'esbuild';
import type { Option } from './normalize-option';
import { normalizeOption } from './normalize-option';

import fs from 'fs-extra';
import path from 'path';
import pretty from 'pretty';

// just a test
// 两种思路：
// 1. 以html作为入口，搜集其中的script src，就像parcel中直接引入index.tsx文件那样
// 然后转换导入路径
// 2. 拿到html模板文件，直接将编译产物js/css文件注入到html文件中

// 应该会选择第二种 但是暂时没看到方便的html ast解析库 这里用了笨办法

export function esbuildHtmlPlugin(options: Option = {}): Plugin {
  const normalizeOptions = normalizeOption(options);

  const {
    title,
    fileName,
    templatePath,
    inject,
    scriptLoading,
    favicon,
    meta,
  } = normalizeOptions;

  return {
    name: 'html',
    async setup(build) {
      // TODO: handle outfile / outdir case
      const { outfile, outdir, bundle } = build.initialOptions;

      const outFileName = path.basename(outfile);
      const outFileDir = path.dirname(outfile);
      const outHtmlPath = path.resolve(outFileDir, fileName);

      const scriptReplaceContent = `
      <body>
        <script ${
          scriptLoading === 'defer' ? 'defer' : ''
        } src="./${outFileName}"></script>
      </body>`;

      const htmlText = fs
        .readFileSync(templatePath, 'utf8')
        .replace('<body></body>', scriptReplaceContent);

      fs.writeFileSync(outHtmlPath, pretty(htmlText));
    },
  };
}
