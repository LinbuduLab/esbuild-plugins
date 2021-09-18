declare module 'astro/dist/dev.js' {
  import devType from 'astro/dist/types/dev';
  export default devType;
}

declare module 'astro/dist/build.js' {
  import { findDeps, build } from 'astro/dist/types/build';
  export default { findDeps, build };
}

declare module 'astro/dist/config.js' {
  import {
    loadConfig,
    formatConfigError,
    validateConfig,
  } from 'astro/dist/types/config';
  export const loadConfig: loadConfig;
  export const formatConfigError: formatConfigError;
  export const validateConfig: validateConfig;
}

declare module 'astro/dist/preview.js' {
  import { preview } from 'astro/dist/types/preview';
  export const preview: preview;
}
