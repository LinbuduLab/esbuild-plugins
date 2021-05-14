import fileSize from 'filesize';

type OptionsInferrer<T> = T extends (bytes: number, options: infer R) => string
  ? R
  : void;

export type FileSizeFormatOption = OptionsInferrer<typeof fileSize>;

export interface ESBuildPluginFileSizeOption {
  showMinifiedSize?: boolean;
  showGzippedSize?: boolean;

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

  outputPath: string;
  buildAt: string;
};

export function normalizeOption({
  showMinifiedSize,
  showGzippedSize,
  format,
  exclude,
}: ESBuildPluginFileSizeOption): NormalizedESBuildPluginFileSizeOption {
  const normalizedOption: NormalizedESBuildPluginFileSizeOption = {
    showMinifiedSize: showMinifiedSize ?? true,
    showGzippedSize: showGzippedSize ?? true,
    theme: 'dark',
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
