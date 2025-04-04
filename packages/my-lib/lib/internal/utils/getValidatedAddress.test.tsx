import { getAddress } from '@/identity/utils/getAddress';
import { isBasename } from '@/identity/utils/isBasename';
import { isEns } from '@/identity/utils/isEns';
import { isAddress } from 'viem';
import { base, mainnet } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getValidatedAddress } from './getValidatedAddress';

vi.mock('viem', () => {
  return {
    isAddress: vi.fn(),
  };
});

vi.mock('../../identity/utils/isBasename', () => {
  return {
    isBasename: vi.fn(),
  };
});

vi.mock('../../identity/utils/isEns', () => {
  return {
    isEns: vi.fn(),
  };
});

vi.mock('../../identity/utils/getAddress', () => {
  return {
    getAddress: vi.fn(),
  };
});

describe('getValidatedAddress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the input if it is a valid address', async () => {
    const input = '0x1234';
    vi.mocked(isAddress).mockReturnValue(true);
    expect(await getValidatedAddress(input)).toBe(input);
  });

  it('should return an address if the input is a valid basename', async () => {
    const input = 'test.base.eth';
    const expectedAddress = '0x1234';
    vi.mocked(isBasename).mockReturnValue(true);
    vi.mocked(getAddress).mockResolvedValue(expectedAddress);

    const testAddress = await getValidatedAddress(input);

    expect(getAddress).toHaveBeenCalledWith({
      name: input,
      chain: base,
    });
    expect(testAddress).toBe(expectedAddress);
  });

  it('should return an address if the input is a valid ens name', async () => {
    const input = 'blahblah';
    const expectedAddress = '0xABCD';
    vi.mocked(isBasename).mockReturnValue(false);
    vi.mocked(isEns).mockReturnValue(true);
    vi.mocked(getAddress).mockResolvedValue(expectedAddress);

    const testAddress = await getValidatedAddress(input);

    expect(getAddress).toHaveBeenCalledWith({
      name: input,
      chain: mainnet,
    });
    expect(testAddress).toBe(expectedAddress);
  });

  it('should return null if the input is not a valid address, basename, or ens name', async () => {
    const input = 'invalid';
    vi.mocked(isBasename).mockReturnValue(false);
    vi.mocked(isEns).mockReturnValue(false);
    vi.mocked(isAddress).mockReturnValue(false);
    expect(await getValidatedAddress(input)).toBeNull();
  });
});
