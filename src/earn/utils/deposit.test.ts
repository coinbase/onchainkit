import { describe, it, expect } from 'vitest';
import { buildDepositToMorphoTx } from './deposit';
import { METAMORPHO_ABI, USDC_ADDRESS, USDC_DECIMALS } from '@/earn/constants';
import { encodeFunctionData, parseUnits } from 'viem';

describe('buildDepositToMorphoTx', () => {
  const mockArgs = {
    vaultAddress: '0xd63070114470f685b75B74D60EEc7c1113d33a3D',
    tokenAddress: USDC_ADDRESS,
    amount: 1000,
    receiverAddress: '0x9E95f497a7663B70404496dB6481c890C4825fe1',
  } as const;

  it('should return an array with two transactions', async () => {
    const result = await buildDepositToMorphoTx(mockArgs);
    expect(result).toHaveLength(2);
  });

  it('should build correct approve transaction', async () => {
    const result = await buildDepositToMorphoTx(mockArgs);
    const expectedAmount = parseUnits(
      mockArgs.amount.toString(),
      USDC_DECIMALS,
    );

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
    const result = await buildDepositToMorphoTx(mockArgs);
    const expectedAmount = parseUnits(
      mockArgs.amount.toString(),
      USDC_DECIMALS,
    );

    const expectedDepositData = encodeFunctionData({
      abi: METAMORPHO_ABI,
      functionName: 'deposit',
      args: [expectedAmount, mockArgs.receiverAddress],
    });

    expect(result[1]).toEqual({
      to: mockArgs.vaultAddress,
      data: expectedDepositData,
    });
  });

  it('should handle zero amount', async () => {
    const result = await buildDepositToMorphoTx({
      ...mockArgs,
      amount: 0,
    });

    expect(result).toHaveLength(2);
    expect(result[0].to).toBe(mockArgs.tokenAddress);
    expect(result[1].to).toBe(mockArgs.vaultAddress);
  });

  it('should handle decimal amounts', async () => {
    const result = await buildDepositToMorphoTx({
      ...mockArgs,
      amount: 100.5,
    });

    const expectedAmount = parseUnits('100.5', USDC_DECIMALS);
    expect(result).toHaveLength(2);
    expect(
      encodeFunctionData({
        abi: METAMORPHO_ABI,
        functionName: 'deposit',
        args: [expectedAmount, mockArgs.receiverAddress],
      }),
    ).toBe(result[1].data);
  });
});
