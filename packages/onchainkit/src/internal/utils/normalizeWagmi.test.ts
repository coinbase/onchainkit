import { describe, it, expect } from 'vitest';
import { normalizeStatus, normalizeTransactionId } from './normalizeWagmi';

describe('normalizeStatus', () => {
  it('should convert CONFIRMED to success', () => {
    expect(normalizeStatus('CONFIRMED')).toBe('success');
  });

  it('should convert PENDING to pending', () => {
    expect(normalizeStatus('PENDING')).toBe('pending');
  });

  it('should return original status if not CONFIRMED or PENDING', () => {
    expect(normalizeStatus('FAILED')).toBe('FAILED');
  });

  it('should handle undefined input', () => {
    expect(normalizeStatus(undefined)).toBe(undefined);
  });
});

describe('normalizeTransactionId', () => {
  it('should return string input', () => {
    expect(normalizeTransactionId('0x123')).toBe('0x123');
  });

  it('should extract id', () => {
    expect(normalizeTransactionId({ id: '0x123' })).toBe('0x123');
  });

  it('should handle extra object properties', () => {
    const txObject = {
      id: '0xabc',
      hash: '0x123',
      other: 'stuff',
    };
    expect(normalizeTransactionId(txObject)).toBe('0xabc');
  });
});
