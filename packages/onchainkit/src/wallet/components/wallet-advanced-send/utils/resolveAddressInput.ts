import type { RecipientState } from '../types';
import { validateAddressInput } from './validateAddressInput';

export async function resolveAddressInput(
  input: string | null,
): Promise<RecipientState> {
  // if there is no user input, return nullish values
  if (!input) {
    return {
      phase: 'input',
      input: '',
      address: null,
      displayValue: null,
    };
  }

  const validatedAddress = await validateAddressInput(input);
  if (!validatedAddress) {
    return {
      phase: 'input',
      input,
      address: null,
      displayValue: null,
    };
  }

  return {
    phase: 'validated',
    input,
    address: validatedAddress,
    displayValue: null,
  };
}
