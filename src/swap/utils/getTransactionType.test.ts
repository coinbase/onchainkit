import { describe, expect, it } from 'vitest';
import type { Call } from '../../transaction/types';
import { getTransactionType } from './getTransactionType'; // Adjust the import path as necessary

describe('getTransactionType', () => {
  const dummyCall: Call = { to: '0x123', data: '0x456', value: 0n };

  it('should return "Permit2" for the first transaction in a sequence of three', () => {
    const transactions = [dummyCall, dummyCall, dummyCall];
    expect(getTransactionType(transactions, 0)).toBe('Permit2');
  });

  it('should return "ERC20" for the second-to-last transaction', () => {
    const transactions = [dummyCall, dummyCall, dummyCall];
    expect(getTransactionType(transactions, 1)).toBe('ERC20');
  });

  it('should return "Swap" for the last transaction', () => {
    const transactions = [dummyCall, dummyCall, dummyCall];
    expect(getTransactionType(transactions, 2)).toBe('Swap');
  });

  it('should return "Swap" for a single transaction', () => {
    const transactions = [dummyCall];
    expect(getTransactionType(transactions, 0)).toBe('Swap');
  });

  it('should return null for transactions in the middle of a long sequence', () => {
    const transactions = [
      dummyCall,
      dummyCall,
      dummyCall,
      dummyCall,
      dummyCall,
    ];
    expect(getTransactionType(transactions, 2)).toBeNull();
  });

  it('should return "ERC20" and "Swap" for a two-transaction sequence', () => {
    const transactions = [dummyCall, dummyCall];
    expect(getTransactionType(transactions, 0)).toBe('ERC20');
    expect(getTransactionType(transactions, 1)).toBe('Swap');
  });

  it('should return null for negative indices', () => {
    const transactions = [dummyCall, dummyCall, dummyCall];
    expect(getTransactionType(transactions, -1)).toBeNull();
  });

  it('should return null for out-of-bounds indices', () => {
    const transactions = [dummyCall, dummyCall, dummyCall];
    expect(getTransactionType(transactions, 3)).toBeNull();
  });

  it('should handle an empty transaction array', () => {
    const transactions: Call[] = [];
    expect(getTransactionType(transactions, 0)).toBeNull();
  });
});
