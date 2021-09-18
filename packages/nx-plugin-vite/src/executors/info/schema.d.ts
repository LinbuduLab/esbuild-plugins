export interface ViteInfoSchema {
  serveTarget?: string;
  buildTarget?: string;
}

export interface NormalizedViteSchema extends Required<ViteInfoSchema> {}
