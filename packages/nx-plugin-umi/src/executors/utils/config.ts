import { defineConfig, IConfig } from 'umi';
import path from 'path';

// .umirc.ts
// .umirc.production.ts

export const config = (cwd: string, outputPath: string): IConfig => {
  return {
    routes: [{ path: '/', component: '@/pages/index' }],
    analyze: {
      analyzerMode: 'server',
      analyzerPort: 8888,
      openAnalyzer: true,
      // generate stats file while ANALYZE_DUMP exist
      generateStatsFile: false,
      statsFilename: 'stats.json',
      logLevel: 'info',
      defaultSizes: 'parsed', // stat  // gzip
    },
    chunks: ['vendors', 'umi'],
    chainWebpack: function (config, { webpack }) {
      config.merge({
        optimization: {
          splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 3,
            automaticNameDelimiter: '.',
            cacheGroups: {
              vendor: {
                name: 'vendors',
                test({ resource }) {
                  return /[\\/]node_modules[\\/]/.test(resource);
                },
                priority: 10,
              },
            },
          },
        },
      });
    },
    define: {},
    externals: {
      react: 'window.React',
    },
    scripts: ['https://unpkg.com/react@17.0.1/umd/react.production.min.js'],
    forkTSChecker: {
      typescript: {
        enabled: true,
        configFile: path.join(cwd, 'tsconfig.json'),
      },
    },
    hash: true,
    inlineLimit: 10 * 1024,
    metas: [],
    outputPath: `../../${outputPath}`,
  };
};
