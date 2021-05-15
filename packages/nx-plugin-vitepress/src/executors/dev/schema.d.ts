import {
  ServerOptions,
  ProxyOptions,
  CorsOptions,
  WatchOptions,
  HmrOptions,
} from 'vite';

export interface VitepressDevSchema {
  root: string;
  viteConfigPath: string;
  host: string;
  port: number;
  open: boolean | string;
  force: boolean;
  hmr: HmrOptions | boolean;
  proxy: Record<string, string | ProxyOptions>;
  watch: WatchOptions;
  cors: CorsOptions | boolean;
  strictPort: boolean;
  middlewareMode: boolean;
  base?: string;
}

export interface NormalizedVitepressDevSchema {
  root: string;
  serverOptions: ServerOptions;
}
