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
  hashLength: number;
}
