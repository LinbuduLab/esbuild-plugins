import { ServeExecutorSchema } from './schema';
import getBuiltInPlugins from 'ice.js/lib/getBuiltInPlugins';
import { start } from '@alib/build-scripts';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import { startServe } from './lib/start-serve';
// import { startProgrammaticServe } from './lib/programmatic-start-serve';

// ice应用：需要将依赖安装到app目录下
// 这一点作为预检查
// 支持命令式与CLI的启动方式
// 两种启动方式的必须参数不同
// 默认使用命令式

// 重点在于把启动流程插入到哪个位置
export default function runExecutor(options: ServeExecutorSchema) {
  return eachValueFrom(
    startServe(options).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
