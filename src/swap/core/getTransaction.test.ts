import { getTransaction } from './getTransaction';
import type { RawTransactionData, TransactionParams } from '../types';

jest.mock('../../queries/request');

describe('getTransaction', () => {
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
      transaction: {
        chainId: 1,
        data: '0x123456',
        gas: BigInt(100000),
        to: '0xabcdef',
        value: BigInt('1000000000000000000'),
      },
      withParams(params: TransactionParams) {
        const { nonce, maxFeePerGas, maxPriorityFeePerGas } = params;

        return {
          chainId: 1,
          data: '0x123456',
          gas: BigInt(100000),
          to: '0xabcdef',
          value: BigInt('1000000000000000000'),
          nonce,
          maxFeePerGas,
          maxPriorityFeePerGas,
        };
      },
    };

    const result = getTransaction(tx, chainId);

    expect(result.transaction).toEqual(expectedTransaction.transaction);
  });

  it('should be able to add arbitrary params', () => {
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
      transaction: {
        chainId: 1,
        data: '0x123456',
        gas: BigInt(100000),
        to: '0xabcdef',
        value: BigInt('1000000000000000000'),
        nonce: 1,
        maxFeePerGas: BigInt(100000),
        maxPriorityFeePerGas: BigInt(100000),
      },
    };

    const result = getTransaction(tx, chainId);

    const params: TransactionParams = {
      nonce: 1,
      maxFeePerGas: BigInt(100000),
      maxPriorityFeePerGas: BigInt(100000),
    };

    expect(result.withParams(params)).toEqual(expectedTransaction.transaction);
  });
});
