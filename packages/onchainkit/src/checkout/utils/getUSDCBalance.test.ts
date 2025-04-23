import { formatUnits } from 'viem';
import { http } from 'viem';
import { base } from 'viem/chains';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { createConfig } from 'wagmi';
import { readContract } from 'wagmi/actions';
import { mock } from 'wagmi/connectors';
import { CONTRACT_METHODS, USDC_ADDRESS_BASE } from '../constants';
import { getUSDCBalance } from './getUSDCBalance';

vi.mock('wagmi/actions', () => ({
  readContract: vi.fn(),
}));

vi.mock('viem', async () => {
  const actual = await vi.importActual('viem');
  return {
    ...actual,
    formatUnits: vi.fn(),
  };
});

const mockAddress = '0x1234567890123456789012345678901234567890';
const mockConfig = createConfig({
  chains: [base],
  connectors: [
    mock({
      accounts: [mockAddress],
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

describe('getUSDCBalance', () => {
  it('should call readContract with correct parameters and return formatted balance', async () => {
    const mockBalance = BigInt(1000000); // 1 USDC
    const mockFormattedBalance = '1.000000';
    (readContract as Mock).mockResolvedValue(mockBalance);
    (formatUnits as Mock).mockReturnValue(mockFormattedBalance);
    const result = await getUSDCBalance({
      address: mockAddress,
      config: mockConfig,
    });
    expect(readContract).toHaveBeenCalledWith(mockConfig, {
      abi: expect.any(Array),
      address: USDC_ADDRESS_BASE,
      functionName: CONTRACT_METHODS.BALANCE_OF,
      args: [mockAddress],
    });
    expect(formatUnits).toHaveBeenCalledWith(mockBalance, 6);
    expect(result).toBe(mockFormattedBalance);
  });

  it('should handle zero balance correctly', async () => {
    const mockBalance = BigInt(0);
    const mockFormattedBalance = '0.000000';
    (readContract as Mock).mockResolvedValue(mockBalance);
    (formatUnits as Mock).mockReturnValue(mockFormattedBalance);
    const result = await getUSDCBalance({
      address: mockAddress,
      config: mockConfig,
    });
    expect(result).toBe(mockFormattedBalance);
  });

  it('should throw an error if readContract fails', async () => {
    const mockError = new Error('Contract read failed');
    (readContract as Mock).mockRejectedValue(mockError);
    await expect(
      getUSDCBalance({ address: mockAddress, config: mockConfig }),
    ).rejects.toThrow('Contract read failed');
  });
});
