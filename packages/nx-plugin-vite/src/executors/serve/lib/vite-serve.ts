import { ViteServeSchema, Res } from '../schema';
import { from, Observable } from 'rxjs';
import { tap, switchMap, map, mapTo } from 'rxjs/operators';
import { createServer, ViteDevServer } from 'vite';
import chalk from 'chalk';

export interface ServeRes {
  server: ViteDevServer;
  success: boolean;
}

export const startViteServer = (
  schema: ViteServeSchema
): Observable<ServeRes> => {
  // new Observable((subscriber) => {
  //   createServer({
  //     configFile: schema.configFile,
  //     root: schema.root,
  //   }).then((server) => {
  //     // TODO:
  //     // 预置gundam插件
  //     // 暴露事件监听、插件容器、修改模块图等能力
  //     server.listen().then((viteDevServer) => {
  //       subscriber.next({
  //         success: true,
  //       });

  //       viteDevServer.watcher.addListener('error', () => {
  //         subscriber.next({
  //           success: false,
  //         });
  //       });
  //     });
  //   });
  // });
  return from(
    createServer({
      configFile: schema.configFile,
      root: schema.root,
    })
  ).pipe(
    tap(() => {
      console.log(
        ' ',
        chalk.blue('i'),
        chalk.green('Nx-Vite [Serve] Starting')
      );
    }),
    switchMap((server) => {
      return new Observable<ServeRes>((subscriber) => {
        server
          .listen()
          .then((devServer) => {
            devServer.watcher.addListener('error', () => {
              subscriber.error();
            });

            subscriber.next({
              server: devServer,
              success: true,
            });
          })
          .catch(() => {
            subscriber.error();
          });
      });
    })
    // EventListener应该需要用高阶Ob+操作符实现
  );
};
