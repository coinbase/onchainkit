import type { ReactNode } from "react";
import { baseSvg } from "../../../internal/svg/baseSvg";
import { cn, text } from "../../../styles/theme";
import { useOnchainKit } from "../../../useOnchainKit";

type NftNetworkProps = {
  className?: string;
  label?: string;
};

const networkMap = {
  Base: baseSvg,
} as Record<string, ReactNode>;

export function NftNetwork({className, label = 'Network'}:NftNetworkProps) {
  const { chain } = useOnchainKit();

  if (!chain || !networkMap[chain.name]) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between py-2',
        text.label2,
        className,
      )}
    >
      <div>{label}</div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 object-cover">{networkMap[chain.name]}</div>
        <div>{chain.name}</div>
      </div>
    </div>
  );
}
