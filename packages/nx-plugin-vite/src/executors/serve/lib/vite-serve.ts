import { ViteServeSchema } from '../schema';
import { from, Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { createServer, ViteDevServer } from 'vite';
import consola from 'consola';
import chalk from 'chalk';

export interface ServeRes {
  server: ViteDevServer;
  success: boolean;
}

export const startViteServer = (
  schema: ViteServeSchema
): Observable<ServeRes> => {
  return from(
    createServer({
      root: schema.root,
      configFile: schema.configFile,
      server: {
        port: schema.port,
        watch: schema.watch ? {} : null,
      },
    })
  ).pipe(
    tap(() => {
      console.log(chalk.blue('i'), chalk.cyan('Nx-Vite [Serve] Starting'));
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
          .catch((error) => {
            subscriber.error({
              success: false,
              error,
            });
          });
      });
    })
    // EventListener应该需要用高阶Ob+操作符实现
  );
};
