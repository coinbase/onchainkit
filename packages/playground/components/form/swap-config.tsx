import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type React from 'react';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppProvider';

export function SwapConfig() {
  const { defaultMaxSlippage, setDefaultMaxSlippage } = useContext(AppContext);
  const [inputValue, setInputValue] = useState(
    defaultMaxSlippage?.toString() ?? '',
  );

  useEffect(() => {
    setInputValue(defaultMaxSlippage?.toString() ?? '');
  }, [defaultMaxSlippage]);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
  const handleSlippageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (setDefaultMaxSlippage) {
      if (value === '') {
        setDefaultMaxSlippage(0);
      } else {
        const numValue = Number.parseFloat(value);
        if (!Number.isNaN(numValue) && numValue >= 0) {
          setDefaultMaxSlippage(numValue);
        }
      }
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="max-slippage">Max Slippage (%)</Label>
      <Input
        type="number"
        id="max-slippage"
        value={inputValue}
        onChange={handleSlippageChange}
        min="0"
        step="0.1"
        className="w-full·[appearance:textfield]·[&::-webkit-inner-spin-button]:appearance-none·[&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}
