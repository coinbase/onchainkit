function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useMemo, Children, isValidElement, useCallback, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { IdentityProvider } from '../../identity/components/IdentityProvider.js';
import { Spinner } from '../../internal/components/Spinner.js';
import { findComponent } from '../../internal/utils/findComponent.js';
import { cn, pressable, text, color, border } from '../../styles/theme.js';
import { ConnectButton as ConnectButton$1 } from './ConnectButton.js';
import { ConnectWalletText } from './ConnectWalletText.js';
import { useWalletContext } from './WalletProvider.js';
import { jsx } from 'react/jsx-runtime';
function ConnectWallet({
  children,
  className,
  // In a few version we will officially deprecate this prop,
  // but for now we will keep it for backward compatibility.
  text: text$1 = 'Connect Wallet',
  withWalletAggregator = false,
  onConnect
}) {
  // Core Hooks
  const _useWalletContext = useWalletContext(),
    isOpen = _useWalletContext.isOpen,
    setIsOpen = _useWalletContext.setIsOpen;
  const _useAccount = useAccount(),
    accountAddress = _useAccount.address,
    status = _useAccount.status;
  const _useConnect = useConnect(),
    connectors = _useConnect.connectors,
    connect = _useConnect.connect,
    connectStatus = _useConnect.status;

  // State
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    hasClickedConnect = _useState2[0],
    setHasClickedConnect = _useState2[1];

  // Get connectWalletText from children when present,
  // this is used to customize the connect wallet button text
  const _useMemo = useMemo(() => {
      const childrenArray = Children.toArray(children);
      return {
        connectWalletText: childrenArray.find(findComponent(ConnectWalletText))
      };
    }, [children]),
    connectWalletText = _useMemo.connectWalletText;

  // Remove connectWalletText from children if present
  const childrenWithoutConnectWalletText = useMemo(() => {
    return Children.map(children, child => {
      if ( /*#__PURE__*/isValidElement(child) && child.type === ConnectWalletText) {
        return null;
      }
      return child;
    });
  }, [children]);

  // Wallet connect status
  const connector = connectors[0];
  const isLoading = connectStatus === 'pending' || status === 'connecting';

  // Handles
  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  // Effects
  useEffect(() => {
    if (hasClickedConnect && status === 'connected' && onConnect) {
      onConnect();
      setHasClickedConnect(false);
    }
  }, [status, hasClickedConnect, onConnect]);
  if (status === 'disconnected') {
    if (withWalletAggregator) {
      return /*#__PURE__*/jsx(ConnectButton.Custom, {
        children: ({
          openConnectModal
        }) => /*#__PURE__*/jsx("div", {
          className: "flex",
          "data-testid": "ockConnectWallet_Container",
          children: /*#__PURE__*/jsx(ConnectButton$1, {
            className: className,
            connectWalletText: connectWalletText,
            onClick: () => {
              openConnectModal();
              setHasClickedConnect(true);
            },
            text: text$1
          })
        })
      });
    }
    return /*#__PURE__*/jsx("div", {
      className: "flex",
      "data-testid": "ockConnectWallet_Container",
      children: /*#__PURE__*/jsx(ConnectButton$1, {
        className: className,
        connectWalletText: connectWalletText,
        onClick: () => {
          connect({
            connector
          }, {
            onSuccess: () => {
              onConnect?.();
            }
          });
        },
        text: text$1
      })
    });
  }
  if (isLoading) {
    return /*#__PURE__*/jsx("div", {
      className: "flex",
      "data-testid": "ockConnectWallet_Container",
      children: /*#__PURE__*/jsx("button", {
        type: "button",
        "data-testid": "ockConnectAccountButtonInner",
        className: cn(pressable.primary, text.headline, color.inverse, 'inline-flex min-w-[153px] items-center justify-center rounded-xl px-4 py-3', pressable.disabled, className),
        disabled: true,
        children: /*#__PURE__*/jsx(Spinner, {})
      })
    });
  }
  return /*#__PURE__*/jsx(IdentityProvider, {
    address: accountAddress,
    children: /*#__PURE__*/jsx("div", {
      className: "flex gap-4",
      "data-testid": "ockConnectWallet_Container",
      children: /*#__PURE__*/jsx("button", {
        type: "button",
        "data-testid": "ockConnectWallet_Connected",
        className: cn(pressable.secondary, border.radius, color.foreground, 'px-4 py-3', isOpen && 'ock-bg-secondary-active hover:ock-bg-secondary-active', className),
        onClick: handleToggle,
        children: /*#__PURE__*/jsx("div", {
          className: "flex gap-2",
          children: childrenWithoutConnectWalletText
        })
      })
    })
  });
}
export { ConnectWallet };
//# sourceMappingURL=ConnectWallet.js.map
