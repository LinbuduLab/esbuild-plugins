import type { ObjectType } from './types';

export type NonUndefined<T> = T extends undefined ? never : T;

export type Equal<X, Y, A = X, B = never> = (<T>() => T extends X
  ? 1
  : 2) extends <T>() => T extends Y ? 1 : 2
  ? A
  : B;

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type Immutable<T> = { readonly [P in keyof T]: T[P] };

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends ObjectType ? DeepPartial<T[P]> : T[P];
};

export type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends ObjectType ? DeepMutable<T[P]> : T[P];
};

export type DeepImmutable<T> = {
  -readonly [P in keyof T]: T[P] extends ObjectType ? DeepMutable<T[P]> : T[P];
};

export type DeepNonNullable<T> = {
  [P in keyof T]: T[P] extends ObjectType
    ? DeepImmutable<T[P]>
    : NonNullable<T[P]>;
};

export type PickByValueType<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>;

export type OmitByValueType<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? never : Key }[keyof T]
>;
