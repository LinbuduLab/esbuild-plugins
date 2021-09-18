export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined;

export type Falsy = false | '' | 0 | null | undefined;

export type Nullish = null | undefined;

export type FuncType = (...args: unknown[]) => unknown;

export type ObjectType = Record<string, unknown>;

export type ClassType<T> = new (...args: unknown[]) => T;
