import { getName, isBasename } from '@/identity';
import { getSlicedAddress } from '@/identity/utils/getSlicedAddress';
import { type Address, isAddress } from 'viem';
import { base, mainnet } from 'viem/chains';
import type { RecipientAddress } from '../types';
import { validateAddressInput } from './validateAddressInput';

export async function resolveAddressInput(
  selectedRecipientAddress: Address | null,
  recipientInput: string | null,
): Promise<RecipientAddress> {
  if (!recipientInput) {
    return {
      display: '',
      value: null,
    };
  }

  // if the user hasn't selected an address yet, return their input and a validated address (or null)
  if (!selectedRecipientAddress) {
    const validatedAddress = await validateAddressInput(recipientInput);
    return {
      display: recipientInput,
      value: validatedAddress,
    };
  }

  // we now have a selected recipient
  // if the user's input is address-format, then return the sliced address
  if (isAddress(recipientInput)) {
    return {
      display: getSlicedAddress(recipientInput),
      value: selectedRecipientAddress,
    };
  }

  // if the user's input wasn't address-format, then it must have been name-format
  // so try to get and return the name
  // TODO: do i need to do this fetch? can i just display the recipientInput?
  const name = await getName({
    address: selectedRecipientAddress,
    chain: isBasename(recipientInput) ? base : mainnet,
  });
  if (name) {
    return {
      display: name,
      value: selectedRecipientAddress,
    };
  }

  // as a last resort, display the user's input and set the value to null
  return {
    display: recipientInput,
    value: null,
  };
}
