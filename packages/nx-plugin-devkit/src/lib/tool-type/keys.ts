import type { FuncType } from './types';
import type { Equal } from './util';

export type FunctTypeKeys<T extends Record<string, unknown>> = {
  [K in keyof T]-?: T[K] extends FuncType ? K : never;
}[keyof T];

export type NonFuncTypeKeys<T extends Record<string, unknown>> = {
  [K in keyof T]-?: T[K] extends FuncType ? never : K;
}[keyof T];

export type MutableKeys<T extends Record<string, unknown>> = {
  [P in keyof T]-?: Equal<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P,
    never
  >;
}[keyof T];

export type IMmutableKeys<T extends Record<string, unknown>> = {
  [P in keyof T]-?: Equal<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    never,
    P
  >;
}[keyof T];

export type RequiredKeys<T> = {
  [K in keyof T]-?: Record<string, unknown> extends Pick<T, K> ? never : K;
}[keyof T];

export type OptionalKeys<T> = {
  [K in keyof T]-?: Record<string, unknown> extends Pick<T, K> ? never : K;
}[keyof T];
