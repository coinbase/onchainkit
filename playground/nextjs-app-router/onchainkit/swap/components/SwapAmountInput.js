import { useEffect, useCallback, useMemo } from 'react';
import { TextInput } from '../../internal/components/TextInput.js';
import { useValue } from '../../internal/hooks/useValue.js';
import { getRoundedAmount } from '../../internal/utils/getRoundedAmount.js';
import { isValidAmount } from '../../internal/utils/isValidAmount.js';
import { cn, background, border, text, color, pressable } from '../../styles/theme.js';
import '../../token/index.js';
import { formatAmount } from '../utils/formatAmount.js';
import { useSwapContext } from './SwapProvider.js';
import { jsxs, jsx } from 'react/jsx-runtime';
import { TokenSelectDropdown } from '../../token/components/TokenSelectDropdown.js';
import { TokenChip } from '../../token/components/TokenChip.js';
function SwapAmountInput({
  className,
  delayMs = 1000,
  label,
  token,
  type,
  swappableTokens
}) {
  const _useSwapContext = useSwapContext(),
    address = _useSwapContext.address,
    to = _useSwapContext.to,
    from = _useSwapContext.from,
    handleAmountChange = _useSwapContext.handleAmountChange;
  const source = useValue(type === 'from' ? from : to);
  const destination = useValue(type === 'from' ? to : from);
  useEffect(() => {
    if (token) {
      source.setToken(token);
    }
  }, [token, source.setToken]);
  const handleMaxButtonClick = useCallback(() => {
    if (!source.balance) {
      return;
    }
    source.setAmount(source.balance);
    handleAmountChange(type, source.balance);
  }, [source.balance, source.setAmount, handleAmountChange, type]);
  const handleChange = useCallback(amount => {
    handleAmountChange(type, amount);
  }, [handleAmountChange, type]);
  const handleSetToken = useCallback(token => {
    source.setToken(token);
    handleAmountChange(type, source.amount, token);
  }, [source.amount, source.setToken, handleAmountChange, type]);

  // We are mocking the token selectors so I'm not able
  // to test this since the components aren't actually rendering
  const sourceTokenOptions = useMemo(() => {
    return swappableTokens?.filter(({
      symbol
    }) => symbol !== destination.token?.symbol) ?? [];
  }, [swappableTokens, destination.token]);
  const hasInsufficientBalance = type === 'from' && Number(source.balance) < Number(source.amount);
  const formatUSD = amount => {
    if (!amount || amount === '0') {
      return null;
    }
    const roundedAmount = Number(getRoundedAmount(amount, 2));
    return `~$${roundedAmount.toFixed(2)}`;
  };
  return /*#__PURE__*/jsxs("div", {
    className: cn(background.secondary, border.radius, 'box-border flex h-[148px] w-full flex-col items-start p-4', className),
    "data-testid": "ockSwapAmountInput_Container",
    children: [/*#__PURE__*/jsx("div", {
      className: "flex w-full items-center justify-between",
      children: /*#__PURE__*/jsx("span", {
        className: cn(text.label2, color.foregroundMuted),
        children: label
      })
    }), /*#__PURE__*/jsxs("div", {
      className: "flex w-full items-center justify-between",
      children: [/*#__PURE__*/jsx(TextInput, {
        className: cn('mr-2 w-full border-[none] bg-transparent font-display text-[2.5rem]', 'leading-none outline-none', hasInsufficientBalance && address ? color.error : color.foreground),
        placeholder: "0.0",
        delayMs: delayMs,
        value: formatAmount(source.amount),
        setValue: source.setAmount,
        disabled: source.loading,
        onChange: handleChange,
        inputValidator: isValidAmount
      }), sourceTokenOptions.length > 0 ? /*#__PURE__*/jsx(TokenSelectDropdown, {
        token: source.token,
        setToken: handleSetToken,
        options: sourceTokenOptions
      }) : source.token && /*#__PURE__*/jsx(TokenChip, {
        className: pressable.inverse,
        token: source.token
      })]
    }), /*#__PURE__*/jsxs("div", {
      className: "mt-4 flex w-full justify-between",
      children: [/*#__PURE__*/jsx("div", {
        className: "flex items-center",
        children: /*#__PURE__*/jsx("span", {
          className: cn(text.label2, color.foregroundMuted),
          children: formatUSD(source.amountUSD)
        })
      }), /*#__PURE__*/jsx("span", {
        className: cn(text.label2, color.foregroundMuted),
        children: ''
      }), /*#__PURE__*/jsxs("div", {
        className: "flex items-center",
        children: [source.balance && /*#__PURE__*/jsx("span", {
          className: cn(text.label2, color.foregroundMuted),
          children: `Balance: ${getRoundedAmount(source.balance, 8)}`
        }), type === 'from' && address && /*#__PURE__*/jsx("button", {
          type: "button",
          className: "flex cursor-pointer items-center justify-center px-2 py-1",
          "data-testid": "ockSwapAmountInput_MaxButton",
          onClick: handleMaxButtonClick,
          children: /*#__PURE__*/jsx("span", {
            className: cn(text.label1, color.primary),
            children: "Max"
          })
        })]
      })]
    })]
  });
}
export { SwapAmountInput };
//# sourceMappingURL=SwapAmountInput.js.map
