import type {
  SignMessageParameters,
  SignTypedDataParameters,
} from 'wagmi/actions';
import { type MessageData, Message } from '../types';

function isTypedData(params: MessageData): params is SignTypedDataParameters {
  return !!(
    params?.types &&
    params?.primaryType &&
    typeof params?.message === 'object'
  );
}

function isSignableMessage(
  params: MessageData,
): params is SignMessageParameters {
  return (
    typeof params?.message === 'string' ||
    (typeof params?.message === 'object' &&
      'raw' in params.message &&
      (typeof params.message.raw === 'string' ||
        params.message.raw instanceof Uint8Array))
  );
}

type ValidateMessageResult =
  | { type: MessageType.TYPED_DATA; data: SignTypedDataParameters }
  | { type: MessageType.SIGNABLE_MESSAGE; data: SignMessageParameters }
  | { type: MessageType.INVALID; data: null };

export function validateMessage(
  messageData: MessageData,
): ValidateMessageResult {
  if (isTypedData(messageData)) {
    return {
      type: Message.TYPED_DATA,
      data: messageData,
    };
  }

  if (isSignableMessage(messageData)) {
    return {
      type: Message.SIGNABLE_MESSAGE,
      data: messageData,
    };
  }

  return {
    type: Message.INVALID,
    data: null,
  };
}
