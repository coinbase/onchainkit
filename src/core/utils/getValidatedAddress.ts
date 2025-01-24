import { getAddress } from '@/identity/utils/getAddress';
import { isBasename } from '@/identity/utils/isBasename';
import { isEns } from '@/identity/utils/isEns';
import { isAddress } from 'viem';
import { base, mainnet } from 'viem/chains';

export async function getValidatedAddress(input: string) {
  if (isBasename(input) || isEns(input)) {
    const address = await getAddress({
      name: input,
      chain: isBasename(input) ? base : mainnet,
    });
    if (address) {
      return address;
    }
  } else if (isAddress(input, { strict: false })) {
    return input;
  }
  return null;
}
