# CHANGELOG

## Released 2.0.1

- BugFix: Update build configuration for better CJS & ESM compat support.

## Released 2.0.0

- **BREAKING**: Exported function was renamed from `esbuildPluginAliasPath` to `aliasPath`, to keep same with other plugins's usage style.
- **BREAKING**: Nested path will also be resolved now.
- CHORE: Both CJS and ESM output will be published now, as with `exports` field in packages.json, you will be using the ESM version by `import`, and CJS version by `require`.
