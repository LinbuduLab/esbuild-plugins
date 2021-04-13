export enum AlgorithmsEnum {
  MD5 = 'MD5',
  SHA1 = 'SHA1',
  SHA256 = 'SHA256',
  SHA512 = 'SHA512',
}

export interface Option {
  // main.[hash].js
  // main.[hash:4].js
  dest: string;
  // will override length defined in dest placeholder
  hashLength?: number;
  retainOrigin?: boolean;
  algorithm?: keyof typeof AlgorithmsEnum;
}

export const pattern = /\[hash(?::(\d+))?\]/;

export type NormalizedOption = Required<Option>;

export function normalizeOption({
  dest,
  hashLength,
  retainOrigin,
}: Option): NormalizedOption {
  const normalizedOptions = {
    dest,
    hashLength: hashLength ?? 8,
    retainOrigin: retainOrigin ?? true,
    algorithm: AlgorithmsEnum.MD5,
  };

  if (!dest || typeof dest !== 'string') {
    throw new Error(
      '[esbuild-plugin-hash] dest must be specified as a string!'
    );
  }

  const matchGroup = pattern.exec(dest);

  if (matchGroup && matchGroup[1]) {
    normalizedOptions.hashLength = Number(matchGroup[1]);
  }

  return normalizedOptions;
}
