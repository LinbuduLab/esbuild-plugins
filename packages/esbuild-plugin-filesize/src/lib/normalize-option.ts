import fileSize from 'filesize';

type OptionsInferrer<T> = T extends (bytes: number, options: infer R) => string
  ? R
  : void;

export type FileSizeFormatOption = OptionsInferrer<typeof fileSize>;

export interface Option {
  showMinifiedSize?: boolean;
  showGzippedSize?: boolean;

  format?: FileSizeFormatOption;
  theme?: 'light' | 'dark';
}

export type NormalizedOption = Required<Option>;

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
}: Option): NormalizedOption {
  const normalizedOption: NormalizedOption = {
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
  };

  return normalizedOption;
}
