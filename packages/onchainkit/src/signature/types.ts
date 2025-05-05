import type {
  SignMessageParameters,
  SignTypedDataParameters,
} from 'wagmi/actions';
import type { APIError } from '@/api/types';
import { ReactNode } from 'react';

export type { SignatureProps } from './components/Signature';
export type { SignatureProviderProps } from './components/SignatureProvider';

export enum MessageType {
  SIGNABLE_MESSAGE = 'signable_message',
  TYPED_DATA = 'typed_data',
  INVALID = 'invalid',
}

export type MessageData = {
  domain?: SignTypedDataParameters['domain'];
  types?: SignTypedDataParameters['types'];
  message:
    | SignTypedDataParameters['message']
    | SignMessageParameters['message'];
  primaryType?: SignTypedDataParameters['primaryType'];
};

/**
 * List of Signature lifecycle statuses.
 * The order of the statuses follows the Signature lifecycle.
 */
export type LifecycleStatus =
  | {
      statusName: 'init';
      statusData: null;
    }
  | {
      statusName: 'error';
      statusData: APIError;
    }
  | {
      statusName: 'pending';
      statusData: {
        type: MessageType;
      };
    }
  | {
      statusName: 'success';
      statusData: {
        signature: `0x${string}`;
        type: MessageType;
      };
    }
  | {
      statusName: 'reset';
      statusData: null;
    };

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
