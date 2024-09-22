import { useMemo } from "react";
import { WalletDropdownFundLinkReact } from "../types";
import { getCoinbaseSmartWalletFundUrl } from "../../fund/utils/getCoinbaseSmartWalletFundUrl";
import { WalletDropdownFundLinkButton } from "./WalletDropdownFundLinkButton";

export function WalletDropdownFundLinkCoinbaseSmartWallet({
  ...props
}: WalletDropdownFundLinkReact) {
  const fundingUrl = useMemo(() => {
    return getCoinbaseSmartWalletFundUrl();
  }, []);

  return (
    <WalletDropdownFundLinkButton {...props} fundingUrl={fundingUrl} />
  );
}
