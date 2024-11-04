import { cn } from '../../styles/theme.js';
import { useIsMounted } from '../../useIsMounted.js';
import { useOnchainKit } from '../../useOnchainKit.js';
import { useTheme } from '../../useTheme.js';
import { TransactionProvider } from './TransactionProvider.js';
import { jsx } from 'react/jsx-runtime';
function Transaction({
  calls,
  capabilities,
  chainId,
  className,
  children,
  contracts,
  isSponsored,
  onError,
  onStatus,
  onSuccess
}) {
  const isMounted = useIsMounted();
  const componentTheme = useTheme();
  const _useOnchainKit = useOnchainKit(),
    chain = _useOnchainKit.chain;

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  // If chainId is not provided,
  // use the default chainId from the OnchainKit context
  const accountChainId = chainId ? chainId : chain.id;
  return /*#__PURE__*/jsx(TransactionProvider, {
    calls: calls,
    capabilities: capabilities,
    chainId: accountChainId,
    contracts: contracts,
    isSponsored: isSponsored,
    onError: onError,
    onStatus: onStatus,
    onSuccess: onSuccess,
    children: /*#__PURE__*/jsx("div", {
      className: cn(componentTheme, 'flex w-full flex-col gap-2', className),
      children: children
    })
  });
}
export { Transaction };
//# sourceMappingURL=Transaction.js.map
