import '../../identity/index.js';
import { color } from '../../styles/theme.js';
import { ConnectWallet } from './ConnectWallet.js';
import { ConnectWalletText } from './ConnectWalletText.js';
import { Wallet } from './Wallet.js';
import { WalletDropdown } from './WalletDropdown.js';
import { WalletDropdownDisconnect } from './WalletDropdownDisconnect.js';
import { WalletDropdownLink } from './WalletDropdownLink.js';
import { jsxs, jsx } from 'react/jsx-runtime';
import { Avatar } from '../../identity/components/Avatar.js';
import { Name } from '../../identity/components/Name.js';
import { Identity } from '../../identity/components/Identity.js';
import { Address } from '../../identity/components/Address.js';
import { EthBalance } from '../../identity/components/EthBalance.js';
function WalletDefault() {
  return /*#__PURE__*/jsxs(Wallet, {
    children: [/*#__PURE__*/jsxs(ConnectWallet, {
      children: [/*#__PURE__*/jsx(ConnectWalletText, {
        children: "Connect Wallet"
      }), /*#__PURE__*/jsx(Avatar, {
        className: "h-6 w-6"
      }), /*#__PURE__*/jsx(Name, {})]
    }), /*#__PURE__*/jsxs(WalletDropdown, {
      children: [/*#__PURE__*/jsxs(Identity, {
        className: "px-4 pt-3 pb-2",
        children: [/*#__PURE__*/jsx(Avatar, {}), /*#__PURE__*/jsx(Name, {}), /*#__PURE__*/jsx(Address, {
          className: color.foregroundMuted
        }), /*#__PURE__*/jsx(EthBalance, {})]
      }), /*#__PURE__*/jsx(WalletDropdownLink, {
        icon: "wallet",
        href: "https://keys.coinbase.com",
        target: "_blank",
        children: "Wallet"
      }), /*#__PURE__*/jsx(WalletDropdownDisconnect, {})]
    })]
  });
}
export { WalletDefault };
//# sourceMappingURL=WalletDefault.js.map
