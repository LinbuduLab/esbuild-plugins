# Todo

## nx-plugin-esbuild


- 支持 watchIgnore watchPattern 选项？
- 暴露 esbuild 插件选项，如esbuild.plugins:['esbuild-plugin-tsc']？ 或者是 useXXXPlugin? 然后内置一批
- tsc runner 仅用于 only for type checking，需要在log标明
- 更多esbuild选项支持
- 重构代码...，尤其是拼接输出消息那里
- check platform is node
- serve executor，用esbuild自己的serve吗？
- build executor: assets
- build executor: override: oneOf boolean / string
    "description": "Override origin build/serve target, or specific prefix",
      "oneOf": [{ "type": "boolean" }, { "type": "string" }]
  - 检测文件是否存在、是否是文件、目录类型
