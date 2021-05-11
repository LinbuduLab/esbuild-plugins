import { Plugin } from 'rollup';

// props
// build hooks
// async first sequential parallel
// output generation hooks

export default function pluginSkeleton(): Plugin {
  return {
    name: 'rollup:skeleton',

    options(options) {
      return options;
    },

    resolveId(id, importer, pluginOptions) {
      return null;
    },

    load(id) {
      return null;
    },

    buildStart(normalizedOptions) {},

    buildEnd(err) {},

    watchChange(id, { event }) {},

    transform(code, id) {
      return null;
    },

    closeWatcher() {},

    moduleParsed(info) {},

    augmentChunkHash(chunk) {},

    banner() {
      return null;
    },

    footer() {
      return null;
    },

    closeBundle() {},

    generateBundle() {},

    intro() {
      return null;
    },

    outro() {
      return null;
    },

    outputOptions(options) {
      return options;
    },

    // renderChunk(code, chunk, options) {
    //   return null;
    // },

    writeBundle(normalizedOptions) {},
  };
}
