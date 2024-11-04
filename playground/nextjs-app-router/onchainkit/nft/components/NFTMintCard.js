import { cn, color, background, border } from '../../styles/theme.js';
import { useIsMounted } from '../../useIsMounted.js';
import { useTheme } from '../../useTheme.js';
import { useMintData } from '../hooks/useMintData.js';
import { LifecycleType } from '../types.js';
import { buildMintTransactionData } from '../utils/buildMintTransactionData.js';
import NFTErrorBoundary from './NFTErrorBoundary.js';
import { NFTErrorFallback } from './NFTErrorFallback.js';
import { NFTLifecycleProvider } from './NFTLifecycleProvider.js';
import { NFTProvider } from './NFTProvider.js';
import { jsx } from 'react/jsx-runtime';
function NFTMintCard({
  children,
  className,
  contractAddress,
  tokenId,
  isSponsored,
  useNFTData = useMintData,
  buildMintTransaction = buildMintTransactionData,
  onStatus,
  onError,
  onSuccess
}) {
  const componentTheme = useTheme();
  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }
  return /*#__PURE__*/jsx(NFTErrorBoundary, {
    fallback: NFTErrorFallback,
    children: /*#__PURE__*/jsx(NFTLifecycleProvider, {
      type: LifecycleType.MINT,
      onStatus: onStatus,
      onError: onError,
      onSuccess: onSuccess,
      children: /*#__PURE__*/jsx(NFTProvider, {
        contractAddress: contractAddress,
        tokenId: tokenId,
        isSponsored: isSponsored,
        useNFTData: useNFTData,
        buildMintTransaction: buildMintTransaction,
        children: /*#__PURE__*/jsx("div", {
          className: cn(componentTheme, color.foreground, background.default, border.defaultActive, border.radius, 'flex w-full max-w-[500px] flex-col border px-6 py-4', className),
          "data-testid": "ockNFTMintCard_Container",
          children: children
        })
      })
    })
  });
}
export { NFTMintCard };
//# sourceMappingURL=NFTMintCard.js.map
