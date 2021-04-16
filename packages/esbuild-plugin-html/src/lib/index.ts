import type { Plugin } from 'esbuild';
import type { Option } from './normalize-option';
import fs from 'fs-extra';
import path from 'path';
import pretty from 'pretty';

// just a test
// 两种思路：
// 1. 以html作为入口，搜集其中的script src，就像parcel中直接引入index.tsx文件那样
// 然后转换导入路径
// 2. 拿到html模板文件，直接将编译产物js/css文件注入到html文件中

// 应该会选择第二种 但是暂时没看到方便的html ast解析库 这里用了笨办法

// 选项：
// title meta favicon fileName scriptLoading：应该容易实现
export function esbuildHtmlPlugin(options: Option = {}): Plugin {
  return {
    name: 'html',
    async setup(build) {
      const { outfile, outdir, bundle, publicPath } = build.initialOptions;
      console.log('build.initialOptions: ', build.initialOptions);
      // skip plugin if bundle is false?
      // build.onLoad({ filter: /\.html$/ }, (args) => {
      //   console.log(args);
      //   return {};
      // });
      // waiting for buildEnd hooks
      const htmlTemplatePath = options.templatePath;
      // console.log('htmlTemplatePath: ', htmlTemplatePath);

      const htmlText = fs.readFileSync(htmlTemplatePath, 'utf8').replace(
        '<body></body>',
        `
      <body>
        <script src="./${path.basename(outfile)}"></script>
      </body>
      `
      );

      fs.writeFileSync(
        path.resolve(
          path.dirname(build.initialOptions.outfile),
          path.basename(htmlTemplatePath)
        ),
        pretty(htmlText)
      );
    },
  };
}
