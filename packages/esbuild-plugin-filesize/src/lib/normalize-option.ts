import fileSize from 'filesize';

type OptionsInferrer<T> = T extends (bytes: number, options: infer R) => string
  ? R
  : void;

export type FileSizeFormatOption = OptionsInferrer<typeof fileSize>;

export interface ESBuildPluginFileSizeOption {
  showMinifiedSize?: boolean;
  showGzippedSize?: boolean;
  showBrotliSize?: boolean;
  showPluginTitle?: boolean;

  format?: FileSizeFormatOption;
  theme?: 'light' | 'dark';

  exclude?: string | string[];
}

export interface NormalizedESBuildPluginFileSizeOption
  extends Required<ESBuildPluginFileSizeOption> {
  exclude: string[];
}

export type OutputFileSizeInfo = {
  fileSize: string;
  fileName: string;
  minifiedSize: string;
  gzippedSize: string;
  brotliSize: string;

  outputPath: string;
};

export function normalizeOption({
  showMinifiedSize,
  showGzippedSize,
  showBrotliSize,
  showPluginTitle,
  format,
  exclude,
  theme,
}: ESBuildPluginFileSizeOption): NormalizedESBuildPluginFileSizeOption {
  const normalizedOption: NormalizedESBuildPluginFileSizeOption = {
    showMinifiedSize: showMinifiedSize ?? true,
    showGzippedSize: showGzippedSize ?? true,
    showBrotliSize: showBrotliSize ?? true,
    showPluginTitle: showPluginTitle ?? true,
    theme: theme ?? 'dark',
    format: {
      base: 2,
      bits: false,
      output: 'string',
      round: 2,
      separator: '.',
      spacer: ' ',
      ...(format ?? {}),
    },
    exclude: exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : [],
  };

  return normalizedOption;
}
