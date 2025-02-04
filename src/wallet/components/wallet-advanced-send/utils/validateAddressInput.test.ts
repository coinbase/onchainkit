import { getAddress } from '@/identity/utils/getAddress';
import { isBasename } from '@/identity/utils/isBasename';
import { isEns } from '@/identity/utils/isEns';
import { isAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { validateAddressInput } from './validateAddressInput';

vi.mock('@/identity/utils/isBasename', () => ({
  isBasename: vi.fn(),
}));

vi.mock('@/identity/utils/isEns', () => ({
  isEns: vi.fn(),
}));

vi.mock('@/identity/utils/getAddress', () => ({
  getAddress: vi.fn(),
}));

vi.mock('viem', async () => ({
  isAddress: vi.fn(),
}));

describe('validateAddressInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates basename and returns resolved address on base', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';
    vi.mocked(isBasename).mockReturnValue(true);
    vi.mocked(isEns).mockReturnValue(false);
    vi.mocked(getAddress).mockResolvedValue(mockAddress);

    const result = await validateAddressInput('test.base');

    expect(getAddress).toHaveBeenCalledWith({
      name: 'test.base',
      chain: expect.objectContaining({ id: 8453 }),
    });
    expect(result).toBe(mockAddress);
  });

  it('validates ENS and returns resolved address on mainnet', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';
    vi.mocked(isBasename).mockReturnValue(false);
    vi.mocked(isEns).mockReturnValue(true);
    vi.mocked(getAddress).mockResolvedValue(mockAddress);

    const result = await validateAddressInput('test.eth');

    expect(getAddress).toHaveBeenCalledWith({
      name: 'test.eth',
      chain: expect.objectContaining({ id: 1 }),
    });
    expect(result).toBe(mockAddress);
  });

  it('returns null when name resolution fails', async () => {
    vi.mocked(isBasename).mockReturnValue(true);
    vi.mocked(isEns).mockReturnValue(false);
    vi.mocked(getAddress).mockResolvedValue(null);
    const basenameResult = await validateAddressInput('invalid.base');
    expect(basenameResult).toBeNull();

    vi.mocked(isBasename).mockReturnValue(false);
    vi.mocked(isEns).mockReturnValue(true);
    vi.mocked(getAddress).mockResolvedValue(null);
    const ensResult = await validateAddressInput('invalid.eth');
    expect(ensResult).toBeNull();
  });

  it('validates and returns raw ethereum address', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';
    vi.mocked(isBasename).mockReturnValue(false);
    vi.mocked(isEns).mockReturnValue(false);
    vi.mocked(isAddress).mockReturnValue(true);

    const result = await validateAddressInput(mockAddress);

    expect(isAddress).toHaveBeenCalledWith(mockAddress, { strict: false });
    expect(result).toBe(mockAddress);
  });

  it('returns null for invalid input', async () => {
    vi.mocked(isBasename).mockReturnValue(false);
    vi.mocked(isEns).mockReturnValue(false);
    vi.mocked(isAddress).mockReturnValue(false);

    const result = await validateAddressInput('invalid input');

    expect(result).toBeNull();
  });
});
