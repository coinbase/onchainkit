import { useGetFundingUrl } from '../../fund/hooks/useGetFundingUrl';
import type { WalletDropdownFundLinkReact } from '../types';
import { WalletDropdownFundLinkButton } from './WalletDropdownFundLinkButton';

export function WalletDropdownFundLink({
  fundingUrl,
  ...props
}: WalletDropdownFundLinkReact) {
  const defaultFundingUrl = useGetFundingUrl();

  // If the fundingUrl prop is undefined, fallback to the default funding URL
  const fundingUrlToRender = fundingUrl ?? defaultFundingUrl?.url;
  const popupHeightOverride = fundingUrl
    ? undefined
    : defaultFundingUrl?.popupHeight;
  const popupWidthOverride = fundingUrl
    ? undefined
    : defaultFundingUrl?.popupWidth;

  if (fundingUrlToRender) {
    return (
      <WalletDropdownFundLinkButton
        {...props}
        fundingUrl={fundingUrlToRender}
        popupHeightOverride={popupHeightOverride}
        popupWidthOverride={popupWidthOverride}
      />
    );
  }

  // If the fundingUrl prop is undefined, and we couldn't get a default funding URL (maybe there is no wallet connected,
  // or projectId is undefined in OnchainKitConfig), don't render anything
  return null;
}
