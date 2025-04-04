import type {
  SignMessageParameters,
  SignTypedDataParameters,
} from 'wagmi/actions';
import type { APIError } from '../api/types';

export enum MessageType {
  SIGNABLE_MESSAGE = 'signable_message',
  TYPED_DATA = 'typed_data',
  INVALID = 'invalid',
}

export type ValidateMessageResult =
  | { type: MessageType.TYPED_DATA; data: SignTypedDataParameters }
  | { type: MessageType.SIGNABLE_MESSAGE; data: SignMessageParameters }
  | { type: MessageType.INVALID; data: null };

export type MessageData = {
  domain?: SignTypedDataParameters['domain'];
  types?: SignTypedDataParameters['types'];
  message:
    | SignTypedDataParameters['message']
    | SignMessageParameters['message'];
  primaryType?: SignTypedDataParameters['primaryType'];
};

export type SignatureProviderProps = {
  children: React.ReactNode;
  onSuccess?: (signature: string) => void;
  onError?: (error: APIError) => void;
  onStatus?: (status: LifecycleStatus) => void;
  resetAfter?: number;
} & MessageData;

/**
 * Note: exported as public Type
 */
export type SignatureReact = {
  chainId?: number;
  className?: string;
  onSuccess?: (signature: string) => void;
  onStatus?: (status: LifecycleStatus) => void;
  onError?: (error: APIError) => void;
  resetAfter?: number;
} & (
  | {
      domain?: SignTypedDataParameters['domain'];
      types: SignTypedDataParameters['types'];
      message: SignTypedDataParameters['message'];
      primaryType: SignTypedDataParameters['primaryType'];
    }
  | {
      message: SignMessageParameters['message'];
      domain?: never;
      types?: never;
      primaryType?: never;
    }
) &
  (
    | {
        children: React.ReactNode;
        label?: never;
        disabled?: never;
      }
    | {
        children?: never;
        label?: React.ReactNode;
        disabled?: boolean;
      }
  );

/**
 * List of Signature lifecycle statuses.
 * The order of the statuses follows the Signature lifecycle.
 *
 * Note: exported as public Type
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
