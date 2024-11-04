import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { cn, color, pressable, border } from '../../styles/theme.js';
import { useIsMounted } from '../../useIsMounted.js';
import { useTheme } from '../../useTheme.js';
import { useNFTData } from '../hooks/useNFTData.js';
import { LifecycleType } from '../types.js';
import NFTErrorBoundary from './NFTErrorBoundary.js';
import { NFTErrorFallback } from './NFTErrorFallback.js';
import { NFTLifecycleProvider } from './NFTLifecycleProvider.js';
import { NFTProvider } from './NFTProvider.js';
import { jsx } from 'react/jsx-runtime';
function NFTCard({
  children,
  className,
  contractAddress,
  tokenId,
  useNFTData: useNFTData$1 = useNFTData,
  onStatus,
  onError,
  onSuccess
}) {
  const componentTheme = useTheme();
  const isMounted = useIsMounted();
  const _useAccount = useAccount(),
    chain = _useAccount.chain;
  const handleOnClick = useCallback(() => {
    const network = chain?.name.toLowerCase() ?? 'base';
    const openSeaUrl = `https://opensea.io/assets/${network}/${contractAddress}/${tokenId}`;
    window.open(openSeaUrl, '_blank', 'noopener,noreferrer');
  }, [chain, contractAddress, tokenId]);

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }
  return /*#__PURE__*/jsx(NFTErrorBoundary, {
    fallback: NFTErrorFallback,
    children: /*#__PURE__*/jsx(NFTLifecycleProvider, {
      type: LifecycleType.VIEW,
      onStatus: onStatus,
      onError: onError,
      onSuccess: onSuccess,
      children: /*#__PURE__*/jsx(NFTProvider, {
        contractAddress: contractAddress,
        tokenId: tokenId,
        useNFTData: useNFTData$1,
        children: /*#__PURE__*/jsx("button", {
          type: "button",
          className: cn(componentTheme, color.foreground, pressable.default, border.radius, 'flex w-full max-w-[500px] flex-col items-stretch border p-4 text-left', `hover:border-[${border.defaultActive}]`, className),
          "data-testid": "ockNFTCard_Container",
          onClick: handleOnClick,
          children: children
        })
      })
    })
  });
}
export { NFTCard };
//# sourceMappingURL=NFTCard.js.map
