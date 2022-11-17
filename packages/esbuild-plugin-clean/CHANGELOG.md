# CHANGELOG

## Developing 1.0.0(2022-11-15)

- FEATURE: Option `dryRun` now will enable option `verbose` by default.
- FEATURE: Add `cleanOnStartPatterns` and `cleanOnEndPatterns` options to control clean operation better.
- CHORE: Both CJS and ESM output will be published now, as with `exports` field in packages.json, you will be using the ESM version by `import`, and CJS version by `require`.
