function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useChainId, useAccount } from 'wagmi';
import { Spinner } from '../../../internal/components/Spinner.js';
import { cn, text, color } from '../../../styles/theme.js';
import '../../../transaction/index.js';
import '../../../wallet/index.js';
import { useNFTLifecycleContext } from '../NFTLifecycleProvider.js';
import { useNFTContext } from '../NFTProvider.js';
import { jsx, jsxs } from 'react/jsx-runtime';
import { ConnectWallet } from '../../../wallet/components/ConnectWallet.js';
import { Transaction } from '../../../transaction/components/Transaction.js';
import { TransactionButton } from '../../../transaction/components/TransactionButton.js';
import { TransactionSponsor } from '../../../transaction/components/TransactionSponsor.js';
import { TransactionStatus } from '../../../transaction/components/TransactionStatus.js';
import { TransactionStatusLabel } from '../../../transaction/components/TransactionStatusLabel.js';
import { TransactionStatusAction } from '../../../transaction/components/TransactionStatusAction.js';
function NFTMintButton({
  className,
  label = 'Mint',
  disabled,
  pendingOverride,
  successOverride,
  errorOverride
}) {
  const chainId = useChainId();
  const _useAccount = useAccount(),
    address = _useAccount.address;
  const _useNFTContext = useNFTContext(),
    contractAddress = _useNFTContext.contractAddress,
    tokenId = _useNFTContext.tokenId,
    network = _useNFTContext.network,
    isEligibleToMint = _useNFTContext.isEligibleToMint,
    buildMintTransaction = _useNFTContext.buildMintTransaction,
    isSponsored = _useNFTContext.isSponsored,
    quantity = _useNFTContext.quantity,
    name = _useNFTContext.name;
  const _useNFTLifecycleConte = useNFTLifecycleContext(),
    updateLifecycleStatus = _useNFTLifecycleConte.updateLifecycleStatus;
  const _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    callData = _useState2[0],
    setCallData = _useState2[1];
  const _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    mintError = _useState4[0],
    setMintError = _useState4[1];
  const handleTransactionError = useCallback(error => {
    updateLifecycleStatus({
      statusName: 'error',
      statusData: {
        error: 'Error building mint transaction',
        code: 'NmNBc01',
        // NFT module NFTMintButton component 01 error
        message: error
      }
    });
    setMintError(error);
  }, [updateLifecycleStatus]);
  const fetchTransactions = useCallback(async () => {
    // don't fetch transactions until data is available
    if (name && address && buildMintTransaction && isEligibleToMint) {
      try {
        setCallData([]);
        setMintError(null);
        const mintTransaction = await buildMintTransaction({
          takerAddress: address,
          contractAddress,
          tokenId,
          network,
          quantity
        });
        setCallData(mintTransaction);
      } catch (error) {
        handleTransactionError(error);
      }
    } else {
      setCallData([]);
    }
  }, [address, buildMintTransaction, contractAddress, handleTransactionError, isEligibleToMint, name, network, quantity, tokenId]);
  useEffect(() => {
    // need to fetch calls on quantity change instead of onClick to avoid smart wallet
    // popups getting blocked by safari
    fetchTransactions();
  }, [fetchTransactions]);
  const handleOnStatus = useCallback(transactionStatus => {
    if (transactionStatus.statusName === 'transactionPending') {
      updateLifecycleStatus({
        statusName: 'transactionPending'
      });
    }
    if (transactionStatus.statusName === 'transactionLegacyExecuted' || transactionStatus.statusName === 'success' || transactionStatus.statusName === 'error') {
      updateLifecycleStatus(transactionStatus);
    }
  }, [updateLifecycleStatus]);
  const transactionButtonLabel = useMemo(() => {
    if (isEligibleToMint === false || mintError) {
      return 'Minting not available';
    }
    if (callData.length === 0) {
      return /*#__PURE__*/jsx(Spinner, {});
    }
    return label;
  }, [callData, isEligibleToMint, label, mintError]);
  if (!buildMintTransaction) {
    return null;
  }
  if (!address) {
    return /*#__PURE__*/jsx("div", {
      className: cn('py-2', className),
      children: /*#__PURE__*/jsx(ConnectWallet, {
        className: "w-full"
      })
    });
  }
  return /*#__PURE__*/jsxs("div", {
    className: cn('pt-2', className),
    children: [/*#__PURE__*/jsxs(Transaction, {
      isSponsored: isSponsored,
      chainId: chainId,
      calls: callData,
      onStatus: handleOnStatus,
      children: [/*#__PURE__*/jsx(TransactionButton, {
        text: transactionButtonLabel,
        pendingOverride: pendingOverride,
        successOverride: successOverride,
        errorOverride: errorOverride,
        disabled: disabled || transactionButtonLabel !== label
      }), !mintError && /*#__PURE__*/jsx(TransactionSponsor, {}), /*#__PURE__*/jsxs(TransactionStatus, {
        children: [/*#__PURE__*/jsx(TransactionStatusLabel, {}), /*#__PURE__*/jsx(TransactionStatusAction, {})]
      })]
    }), mintError && /*#__PURE__*/jsx("div", {
      className: cn(text.label2, color.foregroundMuted, 'pb-2'),
      children: mintError
    })]
  });
}
export { NFTMintButton };
//# sourceMappingURL=NFTMintButton.js.map
