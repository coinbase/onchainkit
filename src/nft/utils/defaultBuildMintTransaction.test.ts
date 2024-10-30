import { defaultBuildMintTransaction } from './defaultBuildMintTransaction';
import { buildMintTransaction } from '../../api/buildMintTransaction';
import { type Mock, describe, expect, it, vi } from 'vitest';
import type { Address } from 'viem';

vi.mock('../../api/buildMintTransaction');

describe('defaultBuildMintTransaction', () => {
  const mockBuildMintTransaction = buildMintTransaction as Mock;

  const contractAddress: Address = '0x1234567890abcdef1234567890abcdef12345678';
  const tokenId = '1';
  const network = 'mainnet';
  const quantity = 1;
  const takerAddress: Address = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef';

  it('should return a valid transaction call', async () => {
    mockBuildMintTransaction.mockResolvedValue({
      callData: {
        to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
        data: '0xabcdef',
        value: '1000000000000000000',
      },
    });

    const result = await defaultBuildMintTransaction({
      contractAddress,
      tokenId,
      network,
      quantity,
      takerAddress,
    });

    expect(result).toEqual([
      {
        to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
        data: '0xabcdef',
        value: BigInt('1000000000000000000'),
      },
    ]);
  });

  it('should throw an error if buildMintTransaction returns an error', async () => {
    mockBuildMintTransaction.mockResolvedValue({
      error: true,
      message: 'An error occurred',
    });

    await expect(
      defaultBuildMintTransaction({
        contractAddress,
        tokenId,
        network,
        quantity,
        takerAddress,
      }),
    ).rejects.toThrow('An error occurred');
  });
});
