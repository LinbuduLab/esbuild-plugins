// src/index.ts
import * as path from 'path';
import * as fs from 'fs-extra';
import { IPlugin } from '@alib/build-scripts';

export const plugin: IPlugin = async ({
  getValue,
  applyMethod,
  onHook,
}): Promise<void> => {
  const exportName = 'compress';
  // const distPath = path.join(getValue('TEMP_PATH'), exportName);
  // await fs.copy(path.join(__dirname, './types'), path.join(distPath, 'types')); // 复制类型声明文件

  // 挂载至 appConfig。 appConfig 对应类型为 IAppConfig
  // source 为复制后的目录, specifier 为类型标识符，exportName 为 appConfig 类型名
  // 得到以下结果
  // import { ILogger } from './logger/types'
  // export interface IAppConfig {
  //   logger?: ILogger;
  // }
  // applyMethod('addIceAppConfigTypes', {
  //   source: `./${exportName}/types`,
  //   specifier: '{ ILogger }',
  //   exportName: `${exportName}?: ILogger`,
  // });
  onHook('after.build.compile', ({ err, stats }) => {
    console.log(stats);
  });
};
