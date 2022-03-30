import type { ExecutorContext } from '@nrwl/devkit';
import type { ViteServeSchema } from './schema';
import type { ResolvedServerOptions, ServerOptions, ViteDevServer } from 'vite';

import { preflightCheck } from '../utils/preflight-check';
import { createServer } from 'vite';
import { Observable } from 'rxjs';
import { eachValueFrom } from 'rxjs-for-await';

export interface ServeRes {
  server: ViteDevServer;
  success: boolean;
  baseUrl: string;
}

export default async function* runExecutor(
  schema: ViteServeSchema,
  context: ExecutorContext
) {
  preflightCheck(context, schema.configFile);

  schema.root =
    schema.root ?? context.workspace.projects[context.projectName].root;

  const server = await createServer(schema);

  return yield* eachValueFrom(runViteServer(server));
}

export function composeBaseUrlForCypress(
  serverOptions: ServerOptions & ResolvedServerOptions
) {
  const protocol = serverOptions.https ? 'https' : 'http';
  const hostname = resolveHostname(serverOptions.host);
  const serverBase =
    hostname.host === '127.0.0.1' ? hostname.name : hostname.host;
  const baseUrl = `${protocol}://${serverBase}:${serverOptions.port}`;

  return baseUrl;
}

/**
 * The start method comes from nxextend-vite
 * @param server
 * @returns
 */
export function runViteServer(server: ViteDevServer) {
  return new Observable((subscriber) => {
    let devServer: ViteDevServer;
    try {
      server
        .listen()
        .then((server) => {
          devServer = server;

          const baseUrl = composeBaseUrlForCypress(server.config.server);
          server.printUrls();
          subscriber.next({ success: true, baseUrl });
        })
        .catch((err) => {
          subscriber.error(err);
        });
      return async () => await devServer.close();
    } catch (err) {
      subscriber.error(err);
      throw new Error('Could not start dev server');
    }
  });
}

export function resolveHostname(optionsHost: string | boolean | undefined) {
  let host: string | undefined;
  if (
    optionsHost === undefined ||
    optionsHost === false ||
    optionsHost === 'localhost'
  ) {
    // Use a secure default
    host = '127.0.0.1';
  } else if (optionsHost === true) {
    // If passed --host in the CLI without arguments
    host = undefined; // undefined typically means 0.0.0.0 or :: (listen on all IPs)
  } else {
    host = optionsHost;
  }

  // Set host name to localhost when possible, unless the user explicitly asked for '127.0.0.1'
  const name =
    (optionsHost !== '127.0.0.1' && host === '127.0.0.1') ||
    host === '0.0.0.0' ||
    host === '::' ||
    host === undefined
      ? 'localhost'
      : host;

  return { host, name };
}
