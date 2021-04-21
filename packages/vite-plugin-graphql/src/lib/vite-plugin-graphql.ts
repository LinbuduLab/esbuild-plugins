import type { Plugin } from 'vite';

export const vitePluginGraphql = (): Plugin => {
  return {
    name: 'vite-graphql',
    enforce: undefined,
    apply: undefined,
    options(options) {
      console.log(options);
      return options;
    },
    buildStart(options) {
      console.log(options);
    },
    // resolveId(src, importer, options) {},
    // load(id, ssr) {},
    // transform(code, id, ssr) {},
    // buildEnd(err) {},
    // closeBundle() {},
    config(config, env) {
      console.log(config);
    },
    configResolved(config) {
      console.log(config);
    },
    configureServer(server) {
      console.log(server);
    },
    transformIndexHtml(html) {
      console.log(html);
    },
    handleHotUpdate(ctx) {
      console.log(ctx);
    },
  };
};
