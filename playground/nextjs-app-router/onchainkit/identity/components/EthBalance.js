import { getRoundedAmount } from '../../internal/utils/getRoundedAmount.js';
import { cn, text, color } from '../../styles/theme.js';
import { useGetETHBalance } from '../../wallet/hooks/useGetETHBalance.js';
import { useIdentityContext } from './IdentityProvider.js';
import { jsxs } from 'react/jsx-runtime';
function EthBalance({
  address,
  className
}) {
  const _useIdentityContext = useIdentityContext(),
    contextAddress = _useIdentityContext.address;
  if (!contextAddress && !address) {
    console.error('Address: an Ethereum address must be provided to the Identity or EthBalance component.');
    return null;
  }
  const _useGetETHBalance = useGetETHBalance(address ?? contextAddress),
    balance = _useGetETHBalance.convertedBalance,
    error = _useGetETHBalance.error;
  if (!balance || error) {
    return null;
  }
  return /*#__PURE__*/jsxs("span", {
    "data-testid": "ockEthBalance",
    className: cn(text.label2, color.foregroundMuted, className),
    children: [getRoundedAmount(balance, 4), " ETH"]
  });
}
export { EthBalance };
//# sourceMappingURL=EthBalance.js.map
