import type { APIError } from '@/api/types';
import { ReactNode } from 'react';

type ErrorStatus = {
  statusName: 'error';
  statusData: APIError;
};

type GenericStatus<T> = {
  statusName: string;
  statusData: T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AbstractLifecycleStatus = ErrorStatus | GenericStatus<any>;

export type UseLifecycleStatusReturn<T extends AbstractLifecycleStatus> = [
  lifecycleStatus: T,
  updatelifecycleStatus: (newStatus: LifecycleStatusUpdate<T>) => void,
];

type LifecycleStatusDataShared = Record<string, never>;

// make all keys in T optional if they are in K
type PartialKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>> extends infer O
  ? { [P in keyof O]: O[P] }
  : never;

// check if all keys in T are a key of LifecycleStatusDataShared
type AllKeysInShared<T> = keyof T extends keyof LifecycleStatusDataShared
  ? true
  : false;

/**
 * LifecycleStatus updater type
 * Used to type the statuses used to update LifecycleStatus
 * LifecycleStatusData is persisted across state updates allowing SharedData to be optional except for in init step
 */
export type LifecycleStatusUpdate<T extends AbstractLifecycleStatus> =
  T extends {
    statusName: infer N;
    statusData: infer D;
  }
    ? { statusName: N } & (N extends 'init' // statusData required in statusName "init"
        ? { statusData: D }
        : AllKeysInShared<D> extends true
          ? {
              statusData?: PartialKeys<
                D,
                keyof D & keyof LifecycleStatusDataShared
              >;
            }
          : {
              statusData: PartialKeys<
                D,
                keyof D & keyof LifecycleStatusDataShared
              >;
            })
    : never;

/**
 * Takes a type T and a key K, and makes K required in T
 * e.g. type T = { a?: string, b?: number }
 *      type K = 'a'
 *      type R = MakeRequired<T, K> // { a: string, b?: number }
 */
export type MakeRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Utility for typing component props that support the render prop pattern.
 * Returns a type where props that would conflict with the render prop are separated as a discriminated union.
 *
 * By default, it assumes the potentially clashing props are `className` and `children`.
 * This can be overridden by passing a second argument to the generic.
 */
export type WithRenderProps<
  TProps extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (arg: any) => ReactNode;
  },
  TExclude extends string = 'className' | 'children',
> = Omit<TProps, TExclude | 'render'> &
  (
    | ({
        render?: TProps['render'];
      } & {
        [K in TExclude]?: undefined;
      })
    | ({
        render?: never;
      } & {
        [K in TExclude]?: K extends keyof TProps ? TProps[K] : never;
      })
  );
