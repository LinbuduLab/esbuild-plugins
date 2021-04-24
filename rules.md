# 开发规范

## Nx 插件

- lib 中包含 normalize-schema
- 包含 schema.d.ts
- 为布尔值的 schema 选项提供默认值
- 如果不存在 executors/generators， 不要维持相关 json 文件

## ESBuild 插件

- lib 中包含 esbuild-plugin-xxx
- 在 e2e 中提供 esbuild-xxx-examaple 示例
