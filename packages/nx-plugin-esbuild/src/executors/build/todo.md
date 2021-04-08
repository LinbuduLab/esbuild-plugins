# nx-plugin-esbuild

## Todo:

- 支持 watchIgnore watchPattern 选项？
- 暴露 esbuild 插件选项，如esbuild.plugins:['esbuild-plugin-tsc']
- tsc runner 仅用于 only for type checking，需要在log标明
- esbuild + esbuild-decorator 才是负责构建的
- date-fns >>> dayjs，新增构建耗时
- node-watch >>> Chokidar 新增触发重构建的文件名
- 更多esbuild选项支持
- 重构代码...，尤其是拼接输出消息那里
- external https://github.com/evanw/esbuild/issues/619
  - https://github.com/liady/webpack-node-externals/blob/master/index.js
- esbuild plugin... 感觉可以单独作为一个独立的包
