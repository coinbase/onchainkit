import { getName, isBasename } from '@/identity';
import { getSlicedAddress } from '@/identity/utils/getSlicedAddress';
import { type Address, isAddress } from 'viem';
import { base, mainnet } from 'viem/chains';

export async function resolveAddressInput(
  selectedRecipientAddress: Address | null,
  recipientInput: string | null,
) {
  // if there is no user input, return null
  if (!recipientInput) {
    return null;
  }

  // if the user hasn't selected an address yet, just return their input
  if (!selectedRecipientAddress) {
    return recipientInput;
  }

  // we now have a selected address
  // so if the user's input is address-format, then return the sliced address
  if (isAddress(recipientInput)) {
    return getSlicedAddress(selectedRecipientAddress);
  }

  // if the user's input wasn't address-format, then try to get and return the name
  const name = await getName({
    address: selectedRecipientAddress,
    chain: isBasename(recipientInput) ? base : mainnet,
  });
  if (name) {
    return name;
  }

  // as a last resort, just return the user's input
  return recipientInput;
}
