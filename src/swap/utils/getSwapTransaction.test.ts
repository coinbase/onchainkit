import { describe, expect, it, vi } from 'vitest';
import type { RawTransactionData } from '../types';
/**
 * @vitest-environment node
 */
import { getSwapTransaction } from './getSwapTransaction';

vi.mock('../../network/request');

describe('getSwapTransaction', () => {
  it('should construct an unsigned transaction', () => {
    const tx: RawTransactionData = {
      data: '0x123456',
      gas: '100000',
      to: '0xabcdef',
      from: '0xabcdef',
      gasPrice: '100000',
      value: '1000000000000000000',
    };
    const chainId = '1';
    const expectedTransaction = {
      chainId: 1,
      data: '0x123456',
      gas: BigInt(100000),
      to: '0xabcdef',
      value: BigInt('1000000000000000000'),
    };
    const result = getSwapTransaction(tx, chainId);
    expect(result).toEqual(expectedTransaction);
  });
});
