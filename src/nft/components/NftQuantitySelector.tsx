import { useState } from "react";
import { QuantitySelector } from "../../internal/components/QuantitySelector";
import { cn } from "../../styles/theme";

const DEFAULT_QUANTITY = '1';

type NftQuantitySelectorReact = {
  className?: string;
};

export function NftQuantitySelector({ className }: NftQuantitySelectorReact) {
  const [quantity, setQuantity] = useState(DEFAULT_QUANTITY);

  // this state needs to exist in the NftMint provider
  // maxMintsPerWallet

  return (
    <div className={cn('py-1', className)}>
      <QuantitySelector className={className} onChange={setQuantity} defaultValue={DEFAULT_QUANTITY} maxQuantity={2} placeholder=""/>
    </div>
  )
}