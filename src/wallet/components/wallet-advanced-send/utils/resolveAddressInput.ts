import { getSlicedAddress } from '@/identity/utils/getSlicedAddress';
import { type Address, isAddress } from 'viem';
import type { RecipientAddress } from '../types';
import { validateAddressInput } from './validateAddressInput';

export async function resolveAddressInput(
  selectedAddress: Address | null,
  input: string | null,
): Promise<RecipientAddress> {
  // if there is no user input, return nullish values
  if (!input) {
    return {
      display: '',
      value: null,
    };
  }

  // if the user hasn't selected an address yet, return their input and a validated address
  if (!selectedAddress) {
    const validatedAddress = await validateAddressInput(input);
    return {
      display: input,
      value: validatedAddress,
    };
  }

  // we now have a selected recipient, so the value will always be the selected address
  // if the user's input is address-format, then return the sliced address
  if (isAddress(input)) {
    return {
      display: getSlicedAddress(input),
      value: selectedAddress,
    };
  }

  // otherwise, the user's input is a name, so display the name
  return {
    display: input,
    value: selectedAddress,
  };
}
