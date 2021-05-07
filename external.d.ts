export interface CommitOptions {
  silent?: boolean;
  root?: boolean;
}

export type PayloadAndOptionsTuple<
  Payload,
  Options extends CommitOptions
> = Payload extends undefined ? [undefined?, Options?] : [Payload, Options?];

export type Modules = {
  [key: string]: {
    namespace: boolean;
    state?: Record<string, any>;
    actions?: Fn;
    mutations?: Fn;
    getters?: Fn;
  };
};

export type Fn = {
  [key: string]: (...args: any) => any;
  [key: number]: never;
};

type Z = OptionalKeys<Modules[keyof Modules]>;

export type OptionalKeys<T> = {
  [K in keyof T]-?: Record<string, unknown> extends Pick<T, K> ? K : never;
}[keyof T];

export type GetPropValue<
  T extends Modules,
  Space extends keyof T,
  K extends Z
> = T[Space][K];

export type FuncType = (...args: unknown[]) => unknown;

export type FuncTypeKeys<T extends Modules[keyof Modules]['mutations']> = {
  [K in keyof T]-?: T[K] extends FuncType ? K : never;
}[keyof T];

type ExternalMutations = GetPropValue<Modules, keyof Modules, 'mutations'>;

export type ActionsParams<
  T extends Modules,
  Space extends keyof T,
  State = GetPropValue<T, Space, 'state'>,
  Getters = GetPropValue<T, Space, 'getters'>,
  Actions = GetPropValue<T, Space, 'actions'>,
  Mutations = ExternalMutations
> = {
  commit: <
    K extends FuncTypeKeys<ExternalMutations>,
    P extends Parameters<ExternalMutations[K]>[1],
    O extends CommitOptions & { root: false }
  >(
    key: K,
    ...params: PayloadAndOptionsTuple<P, O>
  ) => ReturnType<ExternalMutations[K]>;
};
