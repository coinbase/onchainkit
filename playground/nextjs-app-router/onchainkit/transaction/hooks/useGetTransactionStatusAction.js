import { useMemo } from 'react';
import { useChainId } from 'wagmi';
import { useShowCallsStatus } from 'wagmi/experimental';
import { getChainExplorer } from '../../network/getChainExplorer.js';
import { cn, text, color } from '../../styles/theme.js';
import { useTransactionContext } from '../components/TransactionProvider.js';
import { jsx } from 'react/jsx-runtime';
function useGetTransactionStatusAction() {
  const _useTransactionContex = useTransactionContext(),
    chainId = _useTransactionContex.chainId,
    receipt = _useTransactionContex.receipt,
    transactionHash = _useTransactionContex.transactionHash,
    transactionId = _useTransactionContex.transactionId;
  const accountChainId = chainId ?? useChainId();
  const _useShowCallsStatus = useShowCallsStatus(),
    showCallsStatus = _useShowCallsStatus.showCallsStatus;
  return useMemo(() => {
    const chainExplorer = getChainExplorer(accountChainId);
    let actionElement = null;

    // EOA will have txn hash
    if (transactionHash) {
      actionElement = /*#__PURE__*/jsx("a", {
        href: `${chainExplorer}/tx/${transactionHash}`,
        target: "_blank",
        rel: "noreferrer",
        children: /*#__PURE__*/jsx("span", {
          className: cn(text.label1, color.primary),
          children: "View transaction"
        })
      });
    }

    // SW will have txn id
    if (transactionId) {
      actionElement = /*#__PURE__*/jsx("button", {
        onClick: () => showCallsStatus({
          id: transactionId
        }),
        type: "button",
        children: /*#__PURE__*/jsx("span", {
          className: cn(text.label1, color.primary),
          children: "View transaction"
        })
      });
    }
    if (receipt) {
      actionElement = null;
    }
    return {
      actionElement
    };
  }, [accountChainId, receipt, showCallsStatus, transactionHash, transactionId]);
}
export { useGetTransactionStatusAction };
//# sourceMappingURL=useGetTransactionStatusAction.js.map
