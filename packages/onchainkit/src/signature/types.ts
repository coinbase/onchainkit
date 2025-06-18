import type {
  SignMessageParameters,
  SignTypedDataParameters,
} from 'wagmi/actions';
import type { APIError } from '@/api/types';

export type { SignatureProps } from './components/Signature';
export type { SignatureProviderProps } from './components/SignatureProvider';

export const Message = {
  SIGNABLE_MESSAGE: 'signable_message',
  TYPED_DATA: 'typed_data',
  INVALID: 'invalid',
} as const;

export type MessageType = (typeof Message)[keyof typeof Message];

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
