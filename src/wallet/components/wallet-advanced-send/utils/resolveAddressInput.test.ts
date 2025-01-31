import { getSlicedAddress } from '@/identity/utils/getSlicedAddress';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resolveAddressInput } from './resolveAddressInput';
import { validateAddressInput } from './validateAddressInput';

vi.mock('@/identity/utils/getSlicedAddress');
vi.mock('./validateAddressInput');

describe('resolveAddressInput', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890';
  const mockSlicedAddress = '0x1234...7890';

  beforeEach(() => {
    vi.mocked(validateAddressInput).mockResolvedValue(mockAddress);
    vi.mocked(getSlicedAddress).mockReturnValue(mockSlicedAddress);
  });

  it('returns empty values when input is null', async () => {
    const result = await resolveAddressInput(null, null);
    expect(result).toEqual({
      display: '',
      value: null,
    });
  });

  it('returns empty values when input is empty string', async () => {
    const result = await resolveAddressInput(null, '');
    expect(result).toEqual({
      display: '',
      value: null,
    });
  });

  it('validates input when no address is selected', async () => {
    const input = '0xabcd';
    const result = await resolveAddressInput(null, input);

    expect(validateAddressInput).toHaveBeenCalledWith(input);
    expect(result).toEqual({
      display: input,
      value: mockAddress,
    });
  });

  it('returns sliced address when input is address format and address is selected', async () => {
    const input = '0x1234567890123456789012345678901234567890';
    const selectedAddress = '0x9876543210987654321098765432109876543210';

    const result = await resolveAddressInput(selectedAddress, input);

    expect(getSlicedAddress).toHaveBeenCalledWith(input);
    expect(result).toEqual({
      display: mockSlicedAddress,
      value: selectedAddress,
    });
  });

  it('returns input name when input is not address format and address is selected', async () => {
    const input = 'Vitalik';
    const selectedAddress = '0x9876543210987654321098765432109876543210';

    const result = await resolveAddressInput(selectedAddress, input);

    expect(result).toEqual({
      display: input,
      value: selectedAddress,
    });
  });
});
