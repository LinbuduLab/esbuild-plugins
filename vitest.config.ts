import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    passWithNoTests: true,
    include: ['packages/**/*.{spec,test}.ts'],
    threads: true,
    coverage: {
      enabled: true,
      reporter: ['html', 'json', 'text'],
      // include: ['src'],
    },
  },
});
