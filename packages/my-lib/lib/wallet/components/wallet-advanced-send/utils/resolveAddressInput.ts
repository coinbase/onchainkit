import { getSlicedAddress } from '@/identity/utils/getSlicedAddress';
import { type Address, isAddress } from 'viem';
import type { Recipient } from '../types';
import { validateAddressInput } from './validateAddressInput';

export async function resolveAddressInput(
  selectedAddress: Address | null,
  input: string | null,
): Promise<Recipient> {
  // if there is no user input, return nullish values
  if (!input) {
    return {
      displayValue: '',
      address: null,
    };
  }

  // if the user hasn't selected an address yet, return their input and a validated address
  if (!selectedAddress) {
    const validatedAddress = await validateAddressInput(input);
    return {
      displayValue: input,
      address: validatedAddress,
    };
  }

  // we now have a selected recipient, so the value will always be the selected address
  // if the user's input is address-format, then return the sliced address
  if (isAddress(input)) {
    return {
      displayValue: getSlicedAddress(input),
      address: selectedAddress,
    };
  }

  // otherwise, the user's input is a name, so display the name
  return {
    displayValue: input,
    address: selectedAddress,
  };
}
