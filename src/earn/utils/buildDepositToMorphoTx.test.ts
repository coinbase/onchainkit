import { MORPHO_VAULT_ABI } from '@/earn/abis/morpho';
import { USDC_ADDRESS, USDC_DECIMALS } from '@/earn/constants';
import { encodeFunctionData, parseUnits } from 'viem';
import { describe, expect, it } from 'vitest';
import {
  type DepositToMorphoArgs,
  buildDepositToMorphoTx,
} from './buildDepositToMorphoTx';

describe('buildDepositToMorphoTx', () => {
  const mockArgs: DepositToMorphoArgs = {
    vaultAddress: '0xd63070114470f685b75B74D60EEc7c1113d33a3D',
    tokenAddress: USDC_ADDRESS,
    amount: parseUnits('1000', USDC_DECIMALS),
    receiverAddress: '0x9E95f497a7663B70404496dB6481c890C4825fe1',
  };

  it('should return an array with two transactions', async () => {
    const result = buildDepositToMorphoTx(mockArgs);
    expect(result).toHaveLength(2);
  });

  it('should build correct approve transaction', async () => {
    const result = buildDepositToMorphoTx(mockArgs);
    const expectedAmount = mockArgs.amount;

    const expectedApproveData = encodeFunctionData({
      abi: [
        {
          name: 'approve',
          type: 'function',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          outputs: [{ type: 'bool' }],
          stateMutability: 'nonpayable',
        },
      ],
      functionName: 'approve',
      args: [mockArgs.vaultAddress, expectedAmount],
    });

    expect(result[0]).toEqual({
      to: mockArgs.tokenAddress,
      data: expectedApproveData,
    });
  });

  it('should build correct deposit transaction', async () => {
    const result = buildDepositToMorphoTx(mockArgs);
    const expectedAmount = mockArgs.amount;

    const expectedDepositData = encodeFunctionData({
      abi: MORPHO_VAULT_ABI,
      functionName: 'deposit',
      args: [expectedAmount, mockArgs.receiverAddress],
    });

    expect(result[1]).toEqual({
      to: mockArgs.vaultAddress,
      data: expectedDepositData,
    });
  });

  it('should handle zero amount', async () => {
    const result = buildDepositToMorphoTx({
      ...mockArgs,
      amount: 0n,
    });

    expect(result).toHaveLength(2);
    expect(result[0].to).toBe(mockArgs.tokenAddress);
    expect(result[1].to).toBe(mockArgs.vaultAddress);
  });

  it('should handle decimal amounts', async () => {
    const result = buildDepositToMorphoTx({
      ...mockArgs,
      amount: parseUnits('100.5', USDC_DECIMALS),
    });

    const expectedAmount = parseUnits('100.5', USDC_DECIMALS);
    expect(result).toHaveLength(2);
    expect(
      encodeFunctionData({
        abi: MORPHO_VAULT_ABI,
        functionName: 'deposit',
        args: [expectedAmount, mockArgs.receiverAddress],
      }),
    ).toBe(result[1].data);
  });
});
