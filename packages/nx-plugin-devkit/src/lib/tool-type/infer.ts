export type Parameters<
  T extends (...args: unknown[]) => unknown[]
> = T extends (...args: infer P) => unknown[] ? P : never;

export type ConstructorParameters<
  T extends new (...args: unknown[]) => unknown[]
> = T extends new (...args: infer P) => unknown[] ? P : never;

export type ReturnType<
  T extends (...args: unknown[]) => unknown[]
> = T extends (...args: unknown[]) => infer R ? R : unknown[];

export type InstanceType<
  T extends new (...args: unknown[]) => unknown[]
> = T extends new (...args: unknown[]) => infer R ? R : unknown[];

export type PromiseType<T extends Promise<unknown>> = T extends Promise<infer U>
  ? U
  : never;
