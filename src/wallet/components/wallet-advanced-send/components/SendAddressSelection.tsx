import { useCallback, useMemo, useState } from 'react';
import { useWalletContext } from '../../WalletProvider';
import type {
  Recipient,
  SendAddressInputProps,
  SendAddressSelectorProps,
} from '../types';
import { resolveAddressInput } from '../utils/resolveAddressInput';
import { SendAddressInput } from './SendAddressInput';
import { SendAddressSelector } from './SendAddressSelector';
import { useSendContext } from './SendProvider';

type SendAddressSelectionProps = {
  classNames?: {
    input?: SendAddressInputProps['classNames'];
    selector?: SendAddressSelectorProps['classNames'];
  };
};

export function SendAddressSelection({
  classNames,
}: SendAddressSelectionProps) {
  const [recipientInput, setRecipientInput] = useState<string>('');
  const [validatedInput, setValidatedInput] = useState<Recipient>({
    displayValue: '',
    address: null,
  });

  const { chain: senderChain } = useWalletContext();
  const {
    selectedRecipient,
    handleRecipientSelection,
    handleRecipientInputChange,
  } = useSendContext();

  const handleClick = useCallback(async () => {
    const resolvedSelection = await resolveAddressInput(
      validatedInput.address,
      validatedInput.displayValue,
    );
    handleRecipientSelection(resolvedSelection);
  }, [validatedInput, handleRecipientSelection]);

  const addressSelector = useMemo(() => {
    if (selectedRecipient.address || !validatedInput.address) {
      return null;
    }
    return (
      <SendAddressSelector
        address={validatedInput.address}
        senderChain={senderChain}
        onClick={handleClick}
        classNames={classNames?.selector}
      />
    );
  }, [
    selectedRecipient,
    validatedInput,
    senderChain,
    handleClick,
    classNames?.selector,
  ]);

  return (
    <div>
      <SendAddressInput
        selectedRecipient={selectedRecipient}
        recipientInput={recipientInput}
        setRecipientInput={setRecipientInput}
        setValidatedInput={setValidatedInput}
        handleRecipientInputChange={handleRecipientInputChange}
        classNames={classNames?.input}
      />
      {addressSelector}
    </div>
  );
}
