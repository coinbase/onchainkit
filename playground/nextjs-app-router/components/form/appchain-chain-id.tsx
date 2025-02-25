import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type React from 'react';
import { useContext, useState } from 'react';
import { AppContext } from '../AppProvider';

export function AppchainChainId() {
  const { appChainChainId, setAppChainChainId } = useContext(AppContext);
  const [inputValue, setInputValue] = useState(
    appChainChainId?.toString() ?? '',
  );

  const handleAppchainChainIdChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setInputValue(value);
    setAppChainChainId(Number.parseInt(value));
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="appchain-chain-id">Appchain Chain ID</Label>
      <Input
        type="number"
        id="appchain-chain-id"
        value={inputValue}
        onChange={handleAppchainChainIdChange}
        min="0"
        step="0.1"
        className="w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}
