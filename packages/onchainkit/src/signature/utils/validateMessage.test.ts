import { describe, expect, it } from 'vitest';
import { MessageType } from '../types';
import { validateMessage } from './validateMessage';

describe('validateMessage', () => {
  it('should validate typed data message', () => {
    const typedData = {
      domain: { name: 'Test', version: '1' },
      types: { Test: [{ name: 'test', type: 'string' }] },
      message: { test: 'test' },
      primaryType: 'Test',
    };

    const result = validateMessage(typedData);
    expect(result).toEqual({
      type: MessageType.TYPED_DATA,
      data: typedData,
    });
  });

  it('should validate signable message', () => {
    const messageData = {
      message: 'Test message',
    };

    const result = validateMessage(messageData);
    expect(result).toEqual({
      type: MessageType.SIGNABLE_MESSAGE,
      data: messageData,
    });
  });

  it('should validate string message', () => {
    const result = validateMessage({ message: 'Test message' });
    expect(result).toEqual({
      type: MessageType.SIGNABLE_MESSAGE,
      data: { message: 'Test message' },
    });
  });

  it('should validate hex raw message', () => {
    const result = validateMessage({
      message: { raw: '0x1234' },
    });
    expect(result).toEqual({
      type: MessageType.SIGNABLE_MESSAGE,
      data: { message: { raw: '0x1234' } },
    });
  });

  it('should validate ByteArray raw message', () => {
    const result = validateMessage({
      message: { raw: new Uint8Array([1, 2, 3, 4]) },
    });
    expect(result).toEqual({
      type: MessageType.SIGNABLE_MESSAGE,
      data: { message: { raw: new Uint8Array([1, 2, 3, 4]) } },
    });
  });

  it('should return invalid for incomplete typed data', () => {
    const invalidTypedData = {
      domain: { name: 'Test', version: '1' },
      types: { Test: [{ name: 'test', type: 'string' }] },
      // missing message and primaryType
    };

    // @ts-expect-error testing invalid input
    const result = validateMessage(invalidTypedData);
    expect(result).toEqual({
      type: MessageType.INVALID,
      data: null,
    });
  });

  it('should return invalid for empty message data', () => {
    // @ts-expect-error testing invalid input
    const result = validateMessage({});
    expect(result).toEqual({
      type: MessageType.INVALID,
      data: null,
    });
  });

  it('should return invalid for null message data', () => {
    // @ts-expect-error testing invalid input
    const result = validateMessage(null);
    expect(result).toEqual({
      type: MessageType.INVALID,
      data: null,
    });
  });
});
