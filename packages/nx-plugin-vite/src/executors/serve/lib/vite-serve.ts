import { ViteServeSchema, Res } from '../schema';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { createServer } from 'vite';

export const startViteServer = (schema: ViteServeSchema): Observable<Res> => {
  return new Observable((subscriber) => {
    createServer({
      configFile: schema.configFile,
      root: schema.root,
    }).then((server) => {
      // TODO:
      // 预置gundam插件
      // 暴露事件监听、插件容器、修改模块图等能力
      server.listen().then((viteDevServer) => {
        subscriber.next({
          success: true,
        });

        viteDevServer.watcher.addListener('error', () => {
          subscriber.next({
            success: false,
          });
        });
      });
    });
  });
};
