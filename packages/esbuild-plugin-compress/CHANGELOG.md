# CHANGELOG

## Released 1.0.1

- BugFix: Update build configuration for better CJS & ESM compat support.

## Released 1.0.0

- **BREAKING**: Option `removeOrigin` was removed, please use option `emitOrigin`(default as `true`) to control whether to emit origin file.
- FEATURE: Add `exclude` option to control which files should be compressed(by `micromatch`).
- CHORE: Both CJS and ESM output will be published now, as with `exports` field in packages.json, you will be using the ESM version by `import`, and CJS version by `require`.
