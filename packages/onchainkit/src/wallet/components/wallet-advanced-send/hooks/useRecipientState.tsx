import { getName } from '@/identity';
import { getSlicedAddress } from '@/identity/utils/getSlicedAddress';
import { useState, useEffect, useCallback } from 'react';
import { base } from 'viem/chains';
import { RecipientState } from '../types';
import { validateAddressInput } from '../utils/validateAddressInput';

export function useRecipientState() {
  const [recipientState, setRecipientState] = useState<RecipientState>({
    phase: 'input',
    input: '',
    address: null,
    displayValue: null,
  });

  const updateRecipientInput = useCallback((input: string) => {
    setRecipientState((prev) => ({
      ...prev,
      input,
    }));
  }, []);

  const validateRecipientInput = useCallback((input: string) => {
    validateAddressInput(input).then((validatedAddress) => {
      if (!validatedAddress) {
        setRecipientState({
          phase: 'input',
          input,
          address: null,
          displayValue: null,
        });
        return;
      }

      setRecipientState({
        phase: 'validated',
        input,
        address: validatedAddress,
        displayValue: null,
      });
    });
  }, []);

  const selectRecipient = useCallback(
    async (selection: Extract<RecipientState, { phase: 'selected' }>) => {
      setRecipientState(selection);
    },
    [],
  );

  const deselectRecipient = useCallback(() => {
    if (recipientState.phase === 'selected') {
      setRecipientState({
        phase: 'validated',
        input: recipientState.input,
        address: recipientState.address,
        displayValue: null,
      });
    } else {
      setRecipientState({
        ...recipientState,
        displayValue: null,
      });
    }
  }, [recipientState]);

  useEffect(() => {
    if (recipientState.phase === 'selected') {
      getName({
        address: recipientState.address,
        chain: base,
      })
        .then((name) => {
          setRecipientState({
            phase: recipientState.phase,
            input: recipientState.input,
            address: recipientState.address,
            displayValue: name ?? getSlicedAddress(recipientState.address),
          });
        })
        .catch(() =>
          setRecipientState({
            phase: recipientState.phase,
            input: recipientState.input,
            address: recipientState.address,
            displayValue: getSlicedAddress(recipientState.address),
          }),
        );
    }
  }, [recipientState.phase, recipientState.address, recipientState.input]);

  return {
    recipientState,
    updateRecipientInput,
    validateRecipientInput,
    selectRecipient,
    deselectRecipient,
  };
}
