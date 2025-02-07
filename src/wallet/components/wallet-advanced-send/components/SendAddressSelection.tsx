import { useCallback, useMemo, useState } from 'react';
import type { RecipientAddress } from '../types';
import { resolveAddressInput } from '../utils/resolveAddressInput';
import { SendAddressInput } from './SendAddressInput';
import { SendAddressSelector } from './SendAddressSelector';
import { useSendContext } from '@/wallet/components/wallet-advanced-send/components/SendProvider';
import { useWalletContext } from '@/wallet/components/WalletProvider';
import type { SendAddressInputProps, SendAddressSelectorProps } from '../types';

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
  const [validatedInput, setValidatedInput] = useState<RecipientAddress>({
    display: '',
    value: null,
  });

  const { chain: senderChain } = useWalletContext();
  const {
    selectedRecipientAddress,
    handleAddressSelection,
    handleRecipientInputChange,
  } = useSendContext();

  const handleClick = useCallback(async () => {
    const resolvedSelection = await resolveAddressInput(
      validatedInput.value,
      validatedInput.display,
    );
    handleAddressSelection(resolvedSelection);
  }, [validatedInput, handleAddressSelection]);

  const addressSelector = useMemo(() => {
    if (selectedRecipientAddress.value || !validatedInput.value) {
      return null;
    }
    return (
      <SendAddressSelector
        address={validatedInput.value}
        senderChain={senderChain}
        handleClick={handleClick}
        classNames={classNames?.selector}
      />
    );
  }, [
    selectedRecipientAddress,
    validatedInput,
    senderChain,
    handleClick,
    classNames?.selector,
  ]);

  return (
    <div>
      <SendAddressInput
        selectedRecipientAddress={selectedRecipientAddress}
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
