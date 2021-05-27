import execa, {
  Options as ExecaOptions,
  ExecaChildProcess,
  ExecaReturnValue,
  ExecaSyncReturnValue,
} from 'execa';
import {
  SnowpackConfig,
  SnowpackPlugin,
  SnowpackPluginFactory,
  logger,
} from 'snowpack';
import chokidar from 'chokidar';

// serve built bundle (serve-handler)
// run node (execa)
// custom commands in run

export interface ServePluginOptions {
  // cwd/preferLocal/...
  execaOptions: ExecaOptions;
  type: 'node' | 'browser';
  debug: boolean;
  // chokidarOptions
}

export type ServePlugin = SnowpackPluginFactory<ServePluginOptions>;

// 需要把这个插件放在最后一个？
// 重启？
// 在watch下不会走optmize
// 在load里面启动？
// 在run中用定时器监听？
// stdin rs/clean/...
// serve static 好像不需要管重启

const snowpackPluginServe: ServePlugin = (
  snowpackConfig: SnowpackConfig,
  pluginOptions: ServePluginOptions
): SnowpackPlugin => {
  let cp: ExecaSyncReturnValue = null;

  return {
    name: 'plugin:serve',
    resolve: {
      input: [],
      output: [],
    },
    async run(options) {},
    // 供build-only的库使用，会在build后执行
    async load({ filePath, isDev, fileExt }) {},
    async optimize(options) {
      // console.log('options: ', options);
      // logger.info('fsddsffdsfdsxxxx', {
      //   name: 'plugin:serve',
      // });
      const executor = () => {
        // if(cp){

        // }
        cp = execa.sync('serve', ['-s', options.buildDirectory], {
          stdio: 'inherit',
        });
      };

      const watcher = chokidar.watch([options.buildDirectory], {
        // assets?
        ignored: ['node_modules', '.git'],
        cwd: options.buildDirectory,
        ignorePermissionErrors: false,
        depth: 99,
      });

      watcher.on('change', (eventName, stats) => {
        console.log('eventName: ', eventName);
        executor();
        // console.log('(eventName,path): ', eventName, stats);
      });

      executor();
    },
    onChange({ filePath }) {},
  };
};

export default snowpackPluginServe;
