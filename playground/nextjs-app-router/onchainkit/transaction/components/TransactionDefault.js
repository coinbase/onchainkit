import { Transaction } from './Transaction.js';
import { TransactionButton } from './TransactionButton.js';
import { TransactionToast } from './TransactionToast.js';
import { TransactionToastAction } from './TransactionToastAction.js';
import { TransactionToastIcon } from './TransactionToastIcon.js';
import { TransactionToastLabel } from './TransactionToastLabel.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function TransactionDefault({
  calls,
  capabilities,
  chainId,
  className,
  contracts,
  disabled,
  onError,
  onStatus,
  onSuccess
}) {
  return /*#__PURE__*/jsxs(Transaction, {
    calls: calls,
    capabilities: capabilities,
    chainId: chainId,
    className: className,
    contracts: contracts,
    onError: onError,
    onStatus: onStatus,
    onSuccess: onSuccess,
    children: [/*#__PURE__*/jsx(TransactionButton, {
      disabled: disabled
    }), /*#__PURE__*/jsxs(TransactionToast, {
      children: [/*#__PURE__*/jsx(TransactionToastIcon, {}), /*#__PURE__*/jsx(TransactionToastLabel, {}), /*#__PURE__*/jsx(TransactionToastAction, {})]
    })]
  });
}
export { TransactionDefault };
//# sourceMappingURL=TransactionDefault.js.map
