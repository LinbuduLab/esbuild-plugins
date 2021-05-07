import type { Plugin, OnLoadArgs, OnLoadResult } from 'esbuild';
import type { ESBuildPluginNodePolyfillOptions } from './normalize-option';
import escapeStringRegexp from 'escape-string-regexp';
import fs from 'fs';
import path from 'path';
import POLYFILLS from './polyfills';
import { getModules } from './module-map';
import { normalizePluginOptions } from './normalize-option';

// 包括对内置模块的处理与全局变量的处理

// onResolve:

const polyfilledBuiltins = getModules();
const polyfilledBuiltinsNames = [...polyfilledBuiltins.keys()];

function commonJsTemplate(importPath: string) {
  return `
const polyfill = require('${importPath}')
if (polyfill && polyfill.default) {
  module.exports = polyfill.default
} else if (polyfill)  {
  module.exports = polyfill
}
if (polyfill) {
  for (let k in polyfill) {
      module.exports[k] = polyfill[k]
  }
}
`;
}
function removeEndingSlash(importee: string) {
  if (importee && importee.slice(-1) === '/') {
    importee = importee.slice(0, -1);
  }
  return importee;
}

async function loadHandler(args: OnLoadArgs): Promise<OnLoadResult> {
  try {
    const isCommonjs = args.namespace.endsWith('commonjs');

    const resolved = polyfilledBuiltins.get(removeEndingSlash(args.path));
    const contents = await (await fs.promises.readFile(resolved)).toString();
    let resolveDir = path.dirname(resolved);

    if (isCommonjs) {
      return {
        loader: 'js',
        contents: commonJsTemplate(args.path),
        resolveDir,
      };
    }
    return {
      loader: 'js',
      contents,
      resolveDir,
    };
  } catch (e) {
    console.error('node-modules-polyfill', e);
    return {
      contents: `export {}`,
      loader: 'js',
    };
  }
}

export function esbuildPluginNodePolyfill(options: {
  name: string;
  namespace: string;
}): Plugin {
  // const normalizeOptions = normalizePluginOptions(options);

  const { namespace, name } = options;

  const commonjsNamespace = namespace + '-commonjs';

  const filter = new RegExp(
    polyfilledBuiltinsNames.map(escapeStringRegexp).join('|') // TODO builtins could end with slash, keep in mind in regex
  );

  return {
    name: 'esbuild:node-polyfill',
    setup(build) {
      build.onResolve({ filter }, (args) => {
        const ignoreRequire = args.namespace === commonjsNamespace;

        if (!polyfilledBuiltins.has(args.path)) {
          return;
        }

        const isCommonjs = !ignoreRequire && args.kind === 'require-call';

        return {
          namespace: isCommonjs ? commonjsNamespace : namespace,
          path: args.path,
        };
      });

      build.onLoad({ filter: /.*/, namespace }, loadHandler);
      build.onLoad({ filter: /.*/, namespace: commonjsNamespace }, loadHandler);
    },
  };
}
