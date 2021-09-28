import type { ViteServeSchema } from '../schema';

import { from, Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { createServer, ViteDevServer } from 'vite';

import chalk from 'chalk';
import consola from 'consola';

export interface ServeRes {
  server: ViteDevServer;
  success: boolean;
}

export const startViteServer = (
  schema: ViteServeSchema
): Observable<ServeRes> => {
  const { root, configFile, port, watch } = schema;

  return from(
    createServer({
      root,
      configFile,
      server: {
        port,
        watch: watch ? {} : null,
      },
    })
  ).pipe(
    tap(() => {
      consola.info(chalk.cyan('Nx-Vite [Start] Starting \n'));
    }),

    switchMap((server) => {
      return new Observable<ServeRes>((subscriber) => {
        server
          .listen(port)
          .then((devServer) => {
            devServer.watcher.addListener('error', (error) => {
              subscriber.error({ error });
            });

            subscriber.next({
              server: devServer,
              success: true,
            });
          })
          .catch((error) => {
            subscriber.error({
              error,
            });
          });
      });
    })
  );
};
