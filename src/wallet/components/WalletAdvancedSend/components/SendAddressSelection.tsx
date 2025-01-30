import { SendAddressInput } from '@/wallet/components/WalletAdvancedSend/components/SendAddressInput';
import { SendAddressSelector } from '@/wallet/components/WalletAdvancedSend/components/SendAddressSelector';
import type { RecipientAddress } from '@/wallet/components/WalletAdvancedSend/types';
import { resolveAddressInput } from '@/wallet/components/WalletAdvancedSend/utils/resolveAddressInput';
import { useCallback, useMemo, useState } from 'react';
import type { Chain } from 'viem';

type SendAddressSelectionProps = {
  selectedRecipientAddress: RecipientAddress;
  senderChain: Chain | null | undefined;
  handleAddressSelection: (selection: RecipientAddress) => void;
  handleRecipientInputChange: () => void;
};

export function SendAddressSelection({
  selectedRecipientAddress,
  senderChain,
  handleAddressSelection,
  handleRecipientInputChange,
}: SendAddressSelectionProps) {
  const [recipientInput, setRecipientInput] = useState<string>('');
  const [validatedInput, setValidatedInput] = useState<RecipientAddress>({
    display: '',
    value: null,
  });

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
      />
    );
  }, [selectedRecipientAddress, validatedInput, senderChain, handleClick]);

  return (
    <div>
      <SendAddressInput
        selectedRecipientAddress={selectedRecipientAddress}
        recipientInput={recipientInput}
        setRecipientInput={setRecipientInput}
        setValidatedInput={setValidatedInput}
        handleRecipientInputChange={handleRecipientInputChange}
      />
      {addressSelector}
    </div>
  );
}
