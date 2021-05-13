import { BuildOptions } from 'vite';

export interface VitepressBuildSchema {
  // required
  root: string;

  // vitepress 目前没有暴露这个API
  // configFile: string;

  // 相对于root
  // 如果指定，会读取其中的配置作为构建选项
  viteConfigPath?: string;

  // relative to root
  // dist
  outDir: string;
  // relative to outDir
  // assets
  assetsDir: string;
  // 4*1024
  assetsInlineLimit: number;
  // false
  sourcemap: boolean | 'inline';
  // "esbuild"
  minify: boolean | 'terser' | 'esbuild';
  // true
  write: boolean;
  // true
  manifest: boolean;
  // true
  brotliSize: boolean;
  // true
  // if want more
  watch: boolean;
}

export interface NormalizedVitepressBuildSchema extends VitepressBuildSchema {
  buildOptions: BuildOptions;
}
