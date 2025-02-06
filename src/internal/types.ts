import type { APIError } from '@/api/types';

type ErrorStatus = {
  statusName: 'error';
  statusData: APIError;
};

type GenericStatus<T> = {
  statusName: string;
  statusData: T;
};

export enum AnalyticsEvent {
  WALLET_CONNECTED = 'walletConnected',
}

export type AnalyticsEventData = {
  [AnalyticsEvent.WALLET_CONNECTED]: {
    address: string;
  };
};

// biome-ignore lint/suspicious/noExplicitAny: generic status can be any type
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
        : D extends null
          ? { statusData?: null }
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
