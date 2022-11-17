# CHANGELOG

## Developing 2.0.0(2022-11-16)

- **BREAKINGS**: `keepStructure` options was deprecated, and now this plugin will always preserve file structure.
- CHORE: Both CJS and ESM output will be published now, as with `exports` field in packages.json, you will be using the ESM version by `import`, and CJS version by `require`.
