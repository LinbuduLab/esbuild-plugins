import { defineConfig } from 'tsup';

export default defineConfig({
  splitting: false,
  sourcemap: false,
  clean: true,
  format: ['esm', 'cjs'],
  legacyOutput: false,
  dts: true,
});
