import type { PayTransaction } from '@/api/types';
import { erc20Abi } from 'viem';
import { describe, expect, it } from 'vitest';
import { COMMERCE_ABI, CONTRACT_METHODS } from '../constants';
import { getCommerceContracts } from './getCommerceContracts';

describe('getCommerceContracts', () => {
  const mockTransaction: PayTransaction = {
    id: 'test-id',
    callData: {
      deadline: '2023-12-31T23:59:59Z',
      feeAmount: '1000000',
      id: '0x1234567890abcdef',
      operator: '0x1111111111111111111111111111111111111111',
      prefix: '0x2222222222222222222222222222222222222222',
      recipient: '0x3333333333333333333333333333333333333333',
      recipientAmount: '10000000',
      recipientCurrency: '0x4444444444444444444444444444444444444444',
      refundDestination: '0x5555555555555555555555555555555555555555',
      signature: '0x6666666666666666666666666666666666666666',
    },
    metaData: {
      chainId: 1,
      contractAddress: '0x7777777777777777777777777777777777777777',
      sender: '0x8888888888888888888888888888888888888888',
      settlementCurrencyAddress: '0x9999999999999999999999999999999999999999',
    },
  };

  it('should return an array with two contract function parameters', () => {
    const result = getCommerceContracts({ transaction: mockTransaction });
    expect(result).toHaveLength(2);
  });

  it('should correctly format the first contract function parameters for ERC20 approval', () => {
    const result = getCommerceContracts({ transaction: mockTransaction });
    const approvalParams = result[0];
    expect(approvalParams.address).toBe(
      mockTransaction.callData.recipientCurrency,
    );
    expect(approvalParams.abi).toBe(erc20Abi);
    expect(approvalParams.functionName).toBe(CONTRACT_METHODS.APPROVE);
    expect(approvalParams.args).toBeDefined();
    if (approvalParams.args) {
      expect(approvalParams.args).toHaveLength(2);
      expect(approvalParams.args[0]).toBe(
        mockTransaction.metaData.contractAddress,
      );
      expect(approvalParams.args[1]).toBe(
        BigInt(mockTransaction.callData.recipientAmount) +
          BigInt(mockTransaction.callData.feeAmount),
      );
    }
  });

  it('should correctly format the second contract function parameters for transferTokenPreApproved', () => {
    const result = getCommerceContracts({ transaction: mockTransaction });
    const transferParams = result[1];
    expect(transferParams.address).toBe(
      mockTransaction.metaData.contractAddress,
    );
    expect(transferParams.abi).toBe(COMMERCE_ABI);
    expect(transferParams.functionName).toBe(
      CONTRACT_METHODS.TRANSFER_TOKEN_PRE_APPROVED,
    );
    expect(transferParams.args).toBeDefined();
    if (transferParams.args) {
      expect(transferParams.args).toHaveLength(1);
      const arg = transferParams.args[0] as Record<string, unknown>;
      expect(arg.id).toBe(mockTransaction.callData.id);
      expect(arg.recipientAmount).toBe(
        BigInt(mockTransaction.callData.recipientAmount),
      );
      expect(arg.deadline).toBe(
        BigInt(
          Math.floor(
            new Date(mockTransaction.callData.deadline).getTime() / 1000,
          ),
        ),
      );
      expect(arg.recipient).toBe(mockTransaction.callData.recipient);
      expect(arg.recipientCurrency).toBe(
        mockTransaction.callData.recipientCurrency,
      );
      expect(arg.refundDestination).toBe(
        mockTransaction.callData.refundDestination,
      );
      expect(arg.feeAmount).toBe(BigInt(mockTransaction.callData.feeAmount));
      expect(arg.operator).toBe(mockTransaction.callData.operator);
      expect(arg.signature).toBe(mockTransaction.callData.signature);
      expect(arg.prefix).toBe(mockTransaction.callData.prefix);
    }
  });
});
