import type { ViteServeSchema } from '../schema';

import { from, Observable } from 'rxjs';
import { tap, exhaustMap } from 'rxjs/operators';
import { createServer, ViteDevServer } from 'vite';
import { RollupWatcherEvent } from 'rollup';
import chalk from 'chalk';
import consola from 'consola';

export interface ServeRes {
  server: ViteDevServer;
  success: boolean;
}

export const startViteAsync = async (schema: ViteServeSchema) => {
  const serverFactory = await createServer(schema);

  consola.info(chalk.cyan('Nx-Vite [Start] Starting \n'));

  const devServer = await serverFactory.listen();
  const {https = false, port} = devServer.config.server

  consola.success(
    `Vite server ready at ${chalk.green(
      `${https ? 'https:' : 'http:'}//localhost:${port}`
    )}`
  );

  try {
    await new Promise<void>((resolve, reject) => {
      devServer.watcher.on('event', (event: RollupWatcherEvent) => {
        event.code === 'ERROR' ? reject() : resolve();
      });
    });

    await devServer.close();

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const startViteServer = (
  schema: ViteServeSchema
): Observable<ServeRes> => {

  const serverFactory = createServer(schema);

  return from(serverFactory).pipe(
    tap(() => {
      consola.info(chalk.cyan('Nx-Vite [Start] Starting \n'));
    }),

    exhaustMap((server) => {
      return new Observable<ServeRes>((subscriber) => {
        server
          .listen()
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
