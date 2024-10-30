var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/swap/components/Swap.tsx
import { Children as Children10, useMemo as useMemo22 } from "react";

// src/internal/utils/findComponent.ts
import { isValidElement } from "react";
function findComponent(component) {
  return (child) => {
    return isValidElement(child) && child.type === component;
  };
}
__name(findComponent, "findComponent");

// src/styles/theme.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
__name(cn, "cn");
var text = {
  body: "ock-font-family font-normal leading-normal",
  caption: "ock-font-family font-semibold text-xs leading-4",
  headline: "ock-font-family font-semibold leading-normal",
  label1: "ock-font-family font-semibold text-sm leading-5",
  label2: "ock-font-family text-sm leading-5",
  legal: "ock-font-family text-xs leading-4",
  title1: "ock-font-family font-semibold text-[1.75rem] leading-9",
  title3: "ock-font-family font-semibold text-xl leading-7"
};
var pressable = {
  default: "cursor-pointer ock-bg-default active:bg-[var(--ock-bg-default-active)] hover:bg-[var(--ock-bg-default-hover)]",
  alternate: "cursor-pointer ock-bg-alternate active:bg-[var(--ock-bg-alternate-active)] hover:[var(--ock-bg-alternate-hover)]",
  inverse: "cursor-pointer ock-bg-inverse active:bg-[var(--ock-bg-inverse-active)] hover:bg-[var(--ock-bg-inverse-hover)]",
  primary: "cursor-pointer ock-bg-primary active:bg-[var(--ock-bg-primary-active)] hover:bg-[var(--ock-bg-primary-hover)]",
  secondary: "cursor-pointer ock-bg-secondary active:bg-[var(--ock-bg-secondary-active)] hover:bg-[var(--ock-bg-secondary-hover)]",
  coinbaseBranding: "cursor-pointer bg-[#0052FF] hover:bg-[#0045D8]",
  shadow: "ock-shadow-default",
  disabled: "opacity-[0.38] pointer-events-none"
};
var background = {
  default: "ock-bg-default",
  alternate: "ock-bg-alternate",
  inverse: "ock-bg-inverse",
  primary: "ock-bg-primary",
  secondary: "ock-bg-secondary",
  error: "ock-bg-error",
  warning: "ock-bg-warning",
  success: "ock-bg-success",
  washed: "ock-bg-primary-washed",
  disabled: "ock-bg-primary-disabled",
  reverse: "ock-bg-default-reverse"
};
var color = {
  inverse: "ock-text-inverse",
  foreground: "ock-text-foreground",
  foregroundMuted: "ock-text-foreground-muted",
  error: "ock-text-error",
  primary: "ock-text-primary",
  success: "ock-text-success",
  warning: "ock-text-warning",
  disabled: "ock-text-disabled"
};
var border = {
  default: "ock-border-default",
  defaultActive: "ock-border-default-active",
  radius: "ock-border-radius",
  radiusInner: "ock-border-radius-inner"
};
var icon = {
  primary: "ock-icon-color-primary",
  foreground: "ock-icon-color-foreground",
  foregroundMuted: "ock-icon-color-foreground-muted",
  inverse: "ock-icon-color-inverse",
  error: "ock-icon-color-error",
  success: "ock-icon-color-success",
  warning: "ock-icon-color-warning"
};
var line = {
  primary: "ock-line-primary border",
  default: "ock-line-default border",
  heavy: "ock-line-heavy border",
  inverse: "ock-line-inverse border"
};

// src/useIsMounted.ts
import { useEffect, useState } from "react";
function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  });
  return isMounted;
}
__name(useIsMounted, "useIsMounted");

// src/internal/hooks/usePreferredColorScheme.ts
import { useEffect as useEffect2, useState as useState2 } from "react";
function usePreferredColorScheme() {
  const [colorScheme, setColorScheme] = useState2("light");
  useEffect2(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setColorScheme(mediaQuery.matches ? "dark" : "light");
    function updateColorScheme(event) {
      setColorScheme(event.matches ? "dark" : "light");
    }
    __name(updateColorScheme, "updateColorScheme");
    mediaQuery.addEventListener("change", updateColorScheme);
    return () => mediaQuery.removeEventListener("change", updateColorScheme);
  }, []);
  return colorScheme;
}
__name(usePreferredColorScheme, "usePreferredColorScheme");

// src/useOnchainKit.tsx
import { useContext } from "react";

// src/OnchainKitProvider.tsx
import { createContext, useMemo } from "react";

// src/OnchainKitConfig.ts
import { baseSepolia } from "viem/chains";
var ONCHAIN_KIT_CONFIG = {
  address: null,
  apiKey: null,
  chain: baseSepolia,
  config: {
    appearance: {
      name: null,
      logo: null,
      mode: null,
      theme: null
    },
    paymaster: null
  },
  rpcUrl: null,
  schemaId: null,
  projectId: null
};

// src/OnchainKitProvider.tsx
var OnchainKitContext = /* @__PURE__ */ createContext(ONCHAIN_KIT_CONFIG);

// src/useOnchainKit.tsx
function useOnchainKit() {
  return useContext(OnchainKitContext);
}
__name(useOnchainKit, "useOnchainKit");

// src/useTheme.ts
function useTheme() {
  const preferredMode = usePreferredColorScheme();
  const { config: { appearance } = {} } = useOnchainKit();
  const { theme = "default", mode = "auto" } = appearance || {};
  if (theme === "cyberpunk" || theme === "base" || theme === "hacker") {
    return theme;
  }
  switch (mode) {
    case "auto":
      return `${theme}-${preferredMode}`;
    case "dark":
      return `${theme}-dark`;
    case "light":
      return `${theme}-light`;
    default:
      return `${theme}-${preferredMode}`;
  }
}
__name(useTheme, "useTheme");

// src/swap/constants.ts
var FALLBACK_DEFAULT_MAX_SLIPPAGE = 3;
var GENERAL_SWAP_ERROR_CODE = "SWAP_ERROR";
var GENERAL_SWAP_QUOTE_ERROR_CODE = "SWAP_QUOTE_ERROR";
var GENERAL_SWAP_BALANCE_ERROR_CODE = "SWAP_BALANCE_ERROR";
var LOW_LIQUIDITY_ERROR_CODE = "SWAP_QUOTE_LOW_LIQUIDITY_ERROR";
var PERMIT2_CONTRACT_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
var TOO_MANY_REQUESTS_ERROR_CODE = "TOO_MANY_REQUESTS_ERROR";
var UNCAUGHT_SWAP_QUOTE_ERROR_CODE = "UNCAUGHT_SWAP_QUOTE_ERROR";
var UNCAUGHT_SWAP_ERROR_CODE = "UNCAUGHT_SWAP_ERROR";
var UNIVERSALROUTER_CONTRACT_ADDRESS = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD";
var USER_REJECTED_ERROR_CODE = "USER_REJECTED";
var SwapMessage = /* @__PURE__ */ function(SwapMessage3) {
  SwapMessage3["BALANCE_ERROR"] = "Error fetching token balance";
  SwapMessage3["CONFIRM_IN_WALLET"] = "Confirm in wallet";
  SwapMessage3["FETCHING_QUOTE"] = "Fetching quote...";
  SwapMessage3["FETCHING_BALANCE"] = "Fetching balance...";
  SwapMessage3["INCOMPLETE_FIELD"] = "Complete the fields to continue";
  SwapMessage3["INSUFFICIENT_BALANCE"] = "Insufficient balance";
  SwapMessage3["LOW_LIQUIDITY"] = "Insufficient liquidity for this trade.";
  SwapMessage3["SWAP_IN_PROGRESS"] = "Swap in progress...";
  SwapMessage3["TOO_MANY_REQUESTS"] = "Too many requests. Please try again later.";
  SwapMessage3["USER_REJECTED"] = "User rejected the transaction";
  return SwapMessage3;
}({});

// src/swap/components/SwapAmountInput.tsx
import { useCallback as useCallback9, useEffect as useEffect6, useMemo as useMemo8 } from "react";

// src/internal/components/TextInput.tsx
import { useCallback } from "react";

// src/internal/hooks/useDebounce.ts
import { useLayoutEffect, useMemo as useMemo2, useRef } from "react";
var useDebounce = /* @__PURE__ */ __name((callback, delay) => {
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });
  let timer;
  const debounce = /* @__PURE__ */ __name((func, delayMs, ...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delayMs);
  }, "debounce");
  return useMemo2(() => {
    return (...args) => {
      return debounce(callbackRef.current, delay, ...args);
    };
  }, [
    delay
  ]);
}, "useDebounce");

// src/internal/components/TextInput.tsx
function TextInput({ "aria-label": ariaLabel, className, delayMs, disabled = false, onBlur, onChange, placeholder: placeholder2, setValue, value, inputValidator = /* @__PURE__ */ __name(() => true, "inputValidator") }) {
  const handleDebounce = useDebounce((value2) => {
    onChange(value2);
  }, delayMs);
  const handleChange = useCallback((evt) => {
    const value2 = evt.target.value;
    if (inputValidator(value2)) {
      setValue(value2);
      if (delayMs > 0) {
        handleDebounce(value2);
      } else {
        onChange(value2);
      }
    }
  }, [
    onChange,
    handleDebounce,
    delayMs,
    setValue,
    inputValidator
  ]);
  return /* @__PURE__ */ React.createElement("input", {
    "aria-label": ariaLabel,
    "data-testid": "ockTextInput_Input",
    type: "text",
    className,
    placeholder: placeholder2,
    value,
    onBlur,
    onChange: handleChange,
    disabled
  });
}
__name(TextInput, "TextInput");

// src/internal/hooks/useValue.ts
import { useMemo as useMemo3 } from "react";
function useValue(object) {
  return useMemo3(() => object, [
    object
  ]);
}
__name(useValue, "useValue");

// src/internal/utils/getRoundedAmount.ts
function getRoundedAmount(balance, fractionDigits) {
  if (balance === "0") {
    return balance;
  }
  const parsedBalance = Number.parseFloat(balance);
  const result = Number(parsedBalance)?.toFixed(fractionDigits).replace(/0+$/, "");
  if (parsedBalance > 0 && Number.parseFloat(result) === 0) {
    return "0";
  }
  return result;
}
__name(getRoundedAmount, "getRoundedAmount");

// src/internal/utils/isValidAmount.ts
function isValidAmount(value) {
  if (value === "") {
    return true;
  }
  const regex = /^[0-9]*\.?[0-9]*$/;
  return regex.test(value);
}
__name(isValidAmount, "isValidAmount");

// src/token/components/TokenImage.tsx
import { useMemo as useMemo4 } from "react";

// src/token/utils/getTokenImageColor.ts
function hashStringToNumber(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}
__name(hashStringToNumber, "hashStringToNumber");
function numberToRgb(hash) {
  const h = Math.abs(hash) % 360;
  const s = Math.abs(hash >> 8) % 31 + 50;
  const l = Math.abs(hash >> 16) % 21 + 40;
  return `hsl(${h}, ${s}%, ${l}%)`;
}
__name(numberToRgb, "numberToRgb");
function getTokenImageColor(str) {
  const hash = hashStringToNumber(`${str}`);
  return numberToRgb(hash);
}
__name(getTokenImageColor, "getTokenImageColor");

// src/token/components/TokenImage.tsx
function TokenImage({ className, size = 24, token }) {
  const { image, name } = token;
  const styles = useMemo4(() => {
    return {
      image: {
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`
      },
      placeholderImage: {
        background: getTokenImageColor(name),
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`
      }
    };
  }, [
    size,
    name
  ]);
  if (!image) {
    return /* @__PURE__ */ React.createElement("div", {
      className: cn("overflow-hidden rounded-full", className),
      "data-testid": "ockTokenImage_NoImage",
      style: styles.image
    }, /* @__PURE__ */ React.createElement("div", {
      style: styles.placeholderImage
    }));
  }
  return /* @__PURE__ */ React.createElement("img", {
    className: cn("overflow-hidden rounded-[50%]", className),
    alt: "token-image",
    "data-testid": "ockTokenImage_Image",
    style: styles.image,
    src: image
  });
}
__name(TokenImage, "TokenImage");

// src/token/components/TokenChip.tsx
function TokenChip({ token, onClick, className }) {
  const componentTheme = useTheme();
  return /* @__PURE__ */ React.createElement("button", {
    type: "button",
    "data-testid": "ockTokenChip_Button",
    className: cn(componentTheme, pressable.secondary, pressable.shadow, "flex w-fit shrink-0 items-center gap-2 rounded-lg py-1 pr-3 pl-1 ", className),
    onClick: /* @__PURE__ */ __name(() => onClick?.(token), "onClick")
  }, /* @__PURE__ */ React.createElement(TokenImage, {
    token,
    size: 24
  }), /* @__PURE__ */ React.createElement("span", {
    className: text.headline
  }, token.symbol));
}
__name(TokenChip, "TokenChip");

// src/token/components/TokenRow.tsx
import { memo } from "react";

// src/token/utils/formatAmount.ts
function formatAmount(amount, options = {}) {
  if (amount === void 0) {
    return "";
  }
  const { locale, minimumFractionDigits, maximumFractionDigits } = options;
  return Number(amount).toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits
  });
}
__name(formatAmount, "formatAmount");

// src/token/components/TokenRow.tsx
var TokenRow = /* @__PURE__ */ memo(/* @__PURE__ */ __name(function TokenRow2({ className, token, amount, onClick, hideImage, hideSymbol }) {
  const componentTheme = useTheme();
  return /* @__PURE__ */ React.createElement("button", {
    "data-testid": "ockTokenRow_Container",
    type: "button",
    className: cn(componentTheme, pressable.default, "flex w-full items-center justify-between px-2 py-1", className),
    onClick: /* @__PURE__ */ __name(() => onClick?.(token), "onClick")
  }, /* @__PURE__ */ React.createElement("span", {
    className: "flex items-center gap-3"
  }, !hideImage && /* @__PURE__ */ React.createElement(TokenImage, {
    token,
    size: 28
  }), /* @__PURE__ */ React.createElement("span", {
    className: "flex flex-col items-start"
  }, /* @__PURE__ */ React.createElement("span", {
    className: cn(text.headline)
  }, token.name), !hideSymbol && /* @__PURE__ */ React.createElement("span", {
    className: cn(text.body, color.foregroundMuted)
  }, token.symbol))), /* @__PURE__ */ React.createElement("span", {
    "data-testid": "ockTokenRow_Amount",
    className: cn(text.body, color.foregroundMuted)
  }, formatAmount(amount, {
    minimumFractionDigits: 2,
    maximumFractionDigits: Number(amount) < 1 ? 5 : 2
  })));
}, "TokenRow"));

// src/token/components/TokenSearch.tsx
import { useCallback as useCallback2, useState as useState3 } from "react";

// src/internal/svg/closeSvg.tsx
var closeSvg = /* @__PURE__ */ React.createElement("svg", {
  "aria-label": "ock-closeSvg",
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("title", null, "Close SVG"), /* @__PURE__ */ React.createElement("path", {
  d: "M2.14921 1L1 2.1492L6.8508 8L1 13.8508L2.1492 15L8 9.1492L13.8508 15L15 13.8508L9.14921 8L15 2.1492L13.8508 1L8 6.8508L2.14921 1Z",
  className: icon.foreground
}));

// src/internal/svg/searchIconSvg.tsx
var searchIconSvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-searchIconSvg",
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M16 14.23L11.89 10.12C12.59 9.09 13 7.84 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C7.84 13 9.09 12.59 10.13 11.89L14.23 16L16 14.23ZM6.5 10.5C4.29 10.5 2.5 8.71 2.5 6.5C2.5 4.29 4.29 2.5 6.5 2.5C8.71 2.5 10.5 4.29 10.5 6.5C10.5 8.71 8.71 10.5 6.5 10.5Z",
  className: icon.foreground
}));

// src/token/components/TokenSelectDropdown.tsx
import { useCallback as useCallback3, useEffect as useEffect3, useRef as useRef2, useState as useState4 } from "react";

// src/token/components/TokenSelectButton.tsx
import { forwardRef } from "react";

// src/internal/svg/caretDownSvg.tsx
var caretDownSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-caretDownSvg",
  role: "img",
  "aria-label": "ock-caretDownSvg",
  width: "16",
  height: "17",
  viewBox: "0 0 16 17",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M12.95 4.85999L8.00001 9.80999L3.05001 4.85999L1.64001 6.27999L8.00001 12.64L14.36 6.27999L12.95 4.85999Z",
  className: icon.foreground
}));

// src/internal/svg/caretUpSvg.tsx
var caretUpSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-caretUpSvg",
  role: "img",
  "aria-label": "ock-caretUpSvg",
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M3.05329 10.9866L7.99996 6.03997L12.9466 10.9866L14.1266 9.80663L7.99996 3.67997L1.87329 9.80663L3.05329 10.9866Z",
  className: icon.foreground
}));

// src/token/components/TokenSelectButton.tsx
var TokenSelectButton = /* @__PURE__ */ forwardRef(/* @__PURE__ */ __name(function TokenSelectButton2({ onClick, token, isOpen, className }, ref) {
  return /* @__PURE__ */ React.createElement("button", {
    type: "button",
    "data-testid": "ockTokenSelectButton_Button",
    className: cn(pressable.default, pressable.shadow, border.radius, line.default, "flex w-fit items-center gap-2 px-3 py-1", className),
    onClick,
    ref
  }, token ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: "w-4"
  }, /* @__PURE__ */ React.createElement(TokenImage, {
    token,
    size: 16
  })), /* @__PURE__ */ React.createElement("span", {
    className: cn(text.headline, color.foreground),
    "data-testid": "ockTokenSelectButton_Symbol"
  }, token.symbol)) : /* @__PURE__ */ React.createElement("span", {
    className: text.headline
  }, "Select token"), /* @__PURE__ */ React.createElement("div", {
    className: "relative flex items-center justify-center"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "absolute top-0 left-0 h-4 w-4"
  }), isOpen ? caretUpSvg : caretDownSvg));
}, "TokenSelectButton"));

// src/token/components/TokenSelectDropdown.tsx
function TokenSelectDropdown({ options, setToken, token }) {
  const componentTheme = useTheme();
  const [isOpen, setIsOpen] = useState4(false);
  const handleToggle = useCallback3(() => {
    setIsOpen(!isOpen);
  }, [
    isOpen
  ]);
  const dropdownRef = useRef2(null);
  const buttonRef = useRef2(null);
  const handleBlur = useCallback3((event) => {
    const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target);
    const isOutsideButton = buttonRef.current && !buttonRef.current.contains(event.target);
    if (isOutsideDropdown && isOutsideButton) {
      setIsOpen(false);
    }
  }, []);
  useEffect3(() => {
    setTimeout(() => {
      document.addEventListener("click", handleBlur);
    }, 0);
    return () => {
      document.removeEventListener("click", handleBlur);
    };
  }, [
    handleBlur
  ]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "relative shrink-0"
  }, /* @__PURE__ */ React.createElement(TokenSelectButton, {
    ref: buttonRef,
    onClick: handleToggle,
    isOpen,
    token
  }), isOpen && /* @__PURE__ */ React.createElement("div", {
    ref: dropdownRef,
    "data-testid": "ockTokenSelectDropdown_List",
    className: cn(componentTheme, border.radius, "absolute right-0 z-10 mt-1 flex max-h-80 w-[200px] flex-col overflow-y-hidden", "ock-scrollbar")
  }, /* @__PURE__ */ React.createElement("div", {
    className: "overflow-y-auto bg-[#ffffff]"
  }, options.map((token2) => /* @__PURE__ */ React.createElement(TokenRow, {
    className: cn(background.inverse, "px-4 py-2"),
    key: token2.name + token2.address,
    token: token2,
    onClick: /* @__PURE__ */ __name(() => {
      setToken(token2);
      handleToggle();
    }, "onClick")
  })))));
}
__name(TokenSelectDropdown, "TokenSelectDropdown");

// src/token/components/TokenSelectModal.tsx
import { useCallback as useCallback4, useEffect as useEffect4, useRef as useRef3, useState as useState5 } from "react";

// src/swap/utils/formatAmount.ts
function formatAmount2(num) {
  if (!/\d+\.?\d*e[+-]*\d+/i.test(num)) {
    return num;
  }
  const [coefficient, exponent] = num.toLowerCase().split("e");
  const exp = Number.parseInt(exponent);
  const [intPart, decPart = ""] = coefficient.split(".");
  const fullNumber = intPart + decPart;
  const newPosition = intPart.length + exp;
  if (newPosition <= 0) {
    return `0.${"0".repeat(Math.abs(newPosition))}${fullNumber}`;
  }
  if (newPosition >= fullNumber.length) {
    return fullNumber + "0".repeat(newPosition - fullNumber.length);
  }
  return `${fullNumber.slice(0, newPosition)}.${fullNumber.slice(newPosition)}`;
}
__name(formatAmount2, "formatAmount");

// src/swap/components/SwapProvider.tsx
import { createContext as createContext2, useCallback as useCallback8, useContext as useContext2, useEffect as useEffect5, useState as useState8 } from "react";
import { base as base2 } from "viem/chains";
import { useAccount as useAccount2, useConfig, useSendTransaction } from "wagmi";
import { useSwitchChain } from "wagmi";
import { useSendCalls } from "wagmi/experimental";

// src/network/definitions/swap.ts
var CDP_GET_SWAP_QUOTE = "cdp_getSwapQuote";
var CDP_GET_SWAP_TRADE = "cdp_getSwapTrade";

// src/version.ts
var version = "0.35.2";

// src/network/constants.ts
var POST_METHOD = "POST";
var JSON_HEADERS = {
  "Content-Type": "application/json",
  "OnchainKit-Version": version
};
var JSON_RPC_VERSION = "2.0";

// src/network/getRPCUrl.ts
var getRPCUrl = /* @__PURE__ */ __name(() => {
  if (!ONCHAIN_KIT_CONFIG.rpcUrl && !ONCHAIN_KIT_CONFIG.apiKey) {
    throw new Error("API Key Unset: You can use the Coinbase Developer Platform RPC by providing an API key in `OnchainKitProvider` or by manually calling `setOnchainKitConfig`: https://portal.cdp.coinbase.com/products/onchainkit");
  }
  return ONCHAIN_KIT_CONFIG.rpcUrl || `https://api.developer.coinbase.com/rpc/v1/${ONCHAIN_KIT_CONFIG.chain.name.replace(" ", "-").toLowerCase()}/${ONCHAIN_KIT_CONFIG.apiKey}`;
}, "getRPCUrl");

// src/network/request.ts
function buildRequestBody(method, params) {
  return {
    id: 1,
    jsonrpc: JSON_RPC_VERSION,
    method,
    params
  };
}
__name(buildRequestBody, "buildRequestBody");
async function sendRequest(method, params) {
  try {
    const body = buildRequestBody(method, params);
    const url = getRPCUrl();
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: JSON_HEADERS,
      method: POST_METHOD
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`sendRequest: error sending request: ${error.message}`);
    throw error;
  }
}
__name(sendRequest, "sendRequest");

// src/swap/utils/getSwapErrorCode.ts
function getSwapErrorCode(context, errorCode) {
  if (errorCode === -32001) {
    return TOO_MANY_REQUESTS_ERROR_CODE;
  }
  if (errorCode === -32602) {
    return LOW_LIQUIDITY_ERROR_CODE;
  }
  if (context === "uncaught-swap") {
    return UNCAUGHT_SWAP_ERROR_CODE;
  }
  if (context === "uncaught-quote") {
    return UNCAUGHT_SWAP_QUOTE_ERROR_CODE;
  }
  if (context === "quote") {
    return GENERAL_SWAP_QUOTE_ERROR_CODE;
  }
  if (context === "balance") {
    return GENERAL_SWAP_BALANCE_ERROR_CODE;
  }
  return GENERAL_SWAP_ERROR_CODE;
}
__name(getSwapErrorCode, "getSwapErrorCode");

// src/swap/utils/fromReadableAmount.ts
function fromReadableAmount(amount, decimals) {
  const [wholePart, fractionalPart = ""] = amount.split(".");
  const paddedFractionalPart = fractionalPart.padEnd(decimals, "0");
  const trimmedFractionalPart = paddedFractionalPart.slice(0, decimals);
  return (BigInt(wholePart + trimmedFractionalPart) * BigInt(10) ** BigInt(decimals - trimmedFractionalPart.length)).toString();
}
__name(fromReadableAmount, "fromReadableAmount");

// src/swap/utils/toReadableAmount.ts
function toReadableAmount(amount, decimals) {
  if (amount.includes(".")) {
    const [wholePart2, fractionalPart2] = amount.split(".");
    const paddedFractionalPart = fractionalPart2.padEnd(decimals, "0");
    const combinedAmount = wholePart2 + paddedFractionalPart;
    return combinedAmount;
  }
  const bigIntAmount = BigInt(amount);
  const divisor = BigInt(10) ** BigInt(decimals);
  const wholePart = (bigIntAmount / divisor).toString();
  const fractionalPart = (bigIntAmount % divisor).toString().padStart(decimals, "0");
  const trimmedFractionalPart = fractionalPart.replace(/0+$/, "");
  return trimmedFractionalPart ? `${wholePart}.${trimmedFractionalPart}` : wholePart;
}
__name(toReadableAmount, "toReadableAmount");

// src/swap/utils/formatDecimals.ts
function formatDecimals(amount, inputInDecimals = true, decimals = 18) {
  let result;
  if (inputInDecimals) {
    result = toReadableAmount(amount, decimals);
  } else {
    result = fromReadableAmount(amount, decimals);
  }
  return result;
}
__name(formatDecimals, "formatDecimals");

// src/api/utils/getAPIParamsForToken.ts
function getAPIParamsForToken(params) {
  const { from, to, amount, amountReference, isAmountInDecimals } = params;
  const { fromAddress } = params;
  const decimals = amountReference === "from" ? from.decimals : to.decimals;
  if (typeof amount !== "string" || amount.trim() === "") {
    return {
      code: "INVALID_INPUT",
      error: "Invalid input: amount must be a non-empty string",
      message: ""
    };
  }
  if (!Number.isInteger(decimals) || decimals < 0) {
    return {
      code: "INVALID_INPUT",
      error: "Invalid input: decimals must be a non-negative integer",
      message: ""
    };
  }
  if (!/^(?:0|[1-9]\d*|\.\d+)(?:\.\d*)?$/.test(amount)) {
    return {
      code: "INVALID_INPUT",
      error: "Invalid input: amount must be a non-negative number string",
      message: ""
    };
  }
  return {
    fromAddress,
    from: from.address || "ETH",
    to: to.address || "ETH",
    amount: isAmountInDecimals ? amount : formatDecimals(amount, false, decimals),
    amountReference: amountReference || "from"
  };
}
__name(getAPIParamsForToken, "getAPIParamsForToken");

// src/api/utils/getSwapTransaction.ts
function getSwapTransaction(rawTx, chainId) {
  const { data, gas, to, value } = rawTx;
  return {
    chainId: Number(chainId),
    data,
    gas: BigInt(gas),
    to,
    value: BigInt(value)
  };
}
__name(getSwapTransaction, "getSwapTransaction");

// src/api/buildSwapTransaction.ts
async function buildSwapTransaction(params) {
  const defaultParams = {
    amountReference: "from",
    isAmountInDecimals: false
  };
  const apiParamsOrError = getAPIParamsForToken({
    ...defaultParams,
    ...params
  });
  if (apiParamsOrError.error) {
    return apiParamsOrError;
  }
  let apiParams = apiParamsOrError;
  if (!params.useAggregator) {
    apiParams = {
      v2Enabled: true,
      ...apiParams
    };
  }
  if (params.maxSlippage) {
    let slippagePercentage = params.maxSlippage;
    if (params.useAggregator) {
      slippagePercentage = (Number(params.maxSlippage) * 10).toString();
    }
    apiParams = {
      slippagePercentage,
      ...apiParams
    };
  }
  try {
    const res = await sendRequest(CDP_GET_SWAP_TRADE, [
      apiParams
    ]);
    if (res.error) {
      return {
        code: getSwapErrorCode("swap", res.error?.code),
        error: res.error.message,
        message: ""
      };
    }
    const trade = res.result;
    return {
      approveTransaction: trade.approveTx ? getSwapTransaction(trade.approveTx, trade.chainId) : void 0,
      fee: trade.fee,
      quote: trade.quote,
      transaction: getSwapTransaction(trade.tx, trade.chainId),
      warning: trade.quote.warning
    };
  } catch (_error) {
    return {
      code: getSwapErrorCode("uncaught-swap"),
      error: "Something went wrong",
      message: ""
    };
  }
}
__name(buildSwapTransaction, "buildSwapTransaction");

// src/api/getSwapQuote.ts
async function getSwapQuote(params) {
  const defaultParams = {
    amountReference: "from",
    isAmountInDecimals: false
  };
  const apiParamsOrError = getAPIParamsForToken({
    ...defaultParams,
    ...params
  });
  if (apiParamsOrError.error) {
    return apiParamsOrError;
  }
  let apiParams = apiParamsOrError;
  if (!params.useAggregator) {
    apiParams = {
      v2Enabled: true,
      ...apiParams
    };
  }
  if (params.maxSlippage) {
    let slippagePercentage = params.maxSlippage;
    if (params.useAggregator) {
      slippagePercentage = (Number(params.maxSlippage) * 10).toString();
    }
    apiParams = {
      slippagePercentage,
      ...apiParams
    };
  }
  try {
    const res = await sendRequest(CDP_GET_SWAP_QUOTE, [
      apiParams
    ]);
    if (res.error) {
      return {
        code: getSwapErrorCode("quote", res.error?.code),
        error: res.error.message,
        message: ""
      };
    }
    return res.result;
  } catch (_error) {
    return {
      code: getSwapErrorCode("uncaught-quote"),
      error: "Something went wrong",
      message: ""
    };
  }
}
__name(getSwapQuote, "getSwapQuote");

// src/internal/hooks/useCapabilitiesSafe.ts
import { useMemo as useMemo5 } from "react";
import { useAccount } from "wagmi";
import { useCapabilities } from "wagmi/experimental";
function useCapabilitiesSafe({ chainId }) {
  const { isConnected } = useAccount();
  const { data: capabilities, error } = useCapabilities({
    query: {
      enabled: isConnected
    }
  });
  return useMemo5(() => {
    if (error || !capabilities || !capabilities[chainId]) {
      return {};
    }
    return capabilities[chainId];
  }, [
    capabilities,
    chainId,
    error
  ]);
}
__name(useCapabilitiesSafe, "useCapabilitiesSafe");

// src/internal/utils/formatTokenAmount.ts
function formatTokenAmount(amount, decimals) {
  const numberAmount = Number(amount) / 10 ** decimals;
  return numberAmount.toString();
}
__name(formatTokenAmount, "formatTokenAmount");

// src/transaction/constants.ts
var GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

// src/transaction/utils/isUserRejectedRequestError.ts
function isUserRejectedRequestError(err) {
  if (err?.cause?.name === "UserRejectedRequestError") {
    return true;
  }
  if (err?.shortMessage?.includes("User rejected the request.")) {
    return true;
  }
  return false;
}
__name(isUserRejectedRequestError, "isUserRejectedRequestError");

// src/swap/hooks/useAwaitCalls.ts
import { useCallback as useCallback5 } from "react";
import { waitForTransactionReceipt } from "wagmi/actions";
import { useCallsStatus } from "wagmi/experimental";
function useAwaitCalls({ accountConfig, lifecycleStatus, updateLifecycleStatus }) {
  const callsId = lifecycleStatus.statusName === "transactionApproved" ? lifecycleStatus.statusData?.callsId : void 0;
  const { data } = useCallsStatus({
    id: callsId || "",
    query: {
      refetchInterval: /* @__PURE__ */ __name((query) => {
        return query.state.data?.status === "CONFIRMED" ? false : 1e3;
      }, "refetchInterval"),
      enabled: callsId !== void 0
    }
  });
  return useCallback5(async () => {
    if (data?.status === "CONFIRMED" && data?.receipts) {
      const transactionReceipt = await waitForTransactionReceipt(accountConfig, {
        confirmations: 1,
        hash: data.receipts[data.receipts.length - 1].transactionHash
      });
      updateLifecycleStatus({
        statusName: "success",
        statusData: {
          transactionReceipt
        }
      });
    }
  }, [
    accountConfig,
    data,
    updateLifecycleStatus
  ]);
}
__name(useAwaitCalls, "useAwaitCalls");

// src/swap/hooks/useFromTo.ts
import { useState as useState6 } from "react";

// src/wallet/hooks/useGetETHBalance.ts
import { useMemo as useMemo6 } from "react";
import { formatUnits } from "viem";
import { useBalance } from "wagmi";
var ETH_DECIMALS = 18;
function useGetETHBalance(address) {
  const ethBalanceResponse = useBalance({
    address
  });
  return useMemo6(() => {
    let error;
    if (ethBalanceResponse?.error) {
      error = {
        code: getSwapErrorCode("balance"),
        error: ethBalanceResponse?.error?.message,
        message: ""
      };
    }
    if (!ethBalanceResponse?.data?.value && ethBalanceResponse?.data?.value !== 0n) {
      return {
        convertedBalance: "",
        error,
        response: ethBalanceResponse,
        roundedBalance: ""
      };
    }
    const convertedBalance = formatUnits(ethBalanceResponse?.data?.value, ETH_DECIMALS);
    const roundedBalance = getRoundedAmount(convertedBalance, 8);
    return {
      convertedBalance,
      error,
      response: ethBalanceResponse,
      roundedBalance
    };
  }, [
    ethBalanceResponse
  ]);
}
__name(useGetETHBalance, "useGetETHBalance");

// src/wallet/hooks/useGetTokenBalance.ts
import { useMemo as useMemo7 } from "react";
import { erc20Abi, formatUnits as formatUnits2 } from "viem";
import { useReadContract } from "wagmi";
function useGetTokenBalance(address, token) {
  const tokenBalanceResponse = useReadContract({
    abi: erc20Abi,
    address: token?.address,
    functionName: "balanceOf",
    args: address ? [
      address
    ] : [],
    query: {
      enabled: !!token?.address && !!address
    }
  });
  return useMemo7(() => {
    let error;
    if (tokenBalanceResponse?.error) {
      error = {
        code: getSwapErrorCode("balance"),
        error: tokenBalanceResponse?.error?.shortMessage,
        message: ""
      };
    }
    if (tokenBalanceResponse?.data !== 0n && !tokenBalanceResponse?.data || !token) {
      return {
        convertedBalance: "",
        error,
        roundedBalance: "",
        response: tokenBalanceResponse
      };
    }
    const convertedBalance = formatUnits2(tokenBalanceResponse?.data, token?.decimals);
    return {
      convertedBalance,
      error,
      response: tokenBalanceResponse,
      roundedBalance: getRoundedAmount(convertedBalance, 8)
    };
  }, [
    token,
    tokenBalanceResponse
  ]);
}
__name(useGetTokenBalance, "useGetTokenBalance");

// src/swap/hooks/useSwapBalances.tsx
function useSwapBalances({ address, fromToken, toToken }) {
  const { convertedBalance: convertedEthBalance, error: ethBalanceError, response: ethBalanceResponse } = useGetETHBalance(address);
  const { convertedBalance: convertedFromBalance, error: fromBalanceError, response: _fromTokenResponse } = useGetTokenBalance(address, fromToken);
  const { convertedBalance: convertedToBalance, error: toBalanceError, response: _toTokenResponse } = useGetTokenBalance(address, toToken);
  const isFromNativeToken = fromToken?.symbol === "ETH";
  const isToNativeToken = toToken?.symbol === "ETH";
  const fromBalanceString = isFromNativeToken ? convertedEthBalance : convertedFromBalance;
  const fromTokenBalanceError = isFromNativeToken ? ethBalanceError : fromBalanceError;
  const toBalanceString = isToNativeToken ? convertedEthBalance : convertedToBalance;
  const toTokenBalanceError = isToNativeToken ? ethBalanceError : toBalanceError;
  const fromTokenResponse = isFromNativeToken ? ethBalanceResponse : _fromTokenResponse;
  const toTokenResponse = isToNativeToken ? ethBalanceResponse : _toTokenResponse;
  return useValue({
    fromBalanceString,
    fromTokenBalanceError,
    fromTokenResponse,
    toBalanceString,
    toTokenBalanceError,
    toTokenResponse
  });
}
__name(useSwapBalances, "useSwapBalances");

// src/swap/hooks/useFromTo.ts
var useFromTo = /* @__PURE__ */ __name((address) => {
  const [fromAmount, setFromAmount] = useState6("");
  const [fromAmountUSD, setFromAmountUSD] = useState6("");
  const [fromToken, setFromToken] = useState6();
  const [toAmount, setToAmount] = useState6("");
  const [toAmountUSD, setToAmountUSD] = useState6("");
  const [toToken, setToToken] = useState6();
  const [toLoading, setToLoading] = useState6(false);
  const [fromLoading, setFromLoading] = useState6(false);
  const { fromBalanceString, fromTokenBalanceError, toBalanceString, toTokenBalanceError, fromTokenResponse, toTokenResponse } = useSwapBalances({
    address,
    fromToken,
    toToken
  });
  const from = useValue({
    balance: fromBalanceString,
    balanceResponse: fromTokenResponse,
    amount: fromAmount,
    setAmount: setFromAmount,
    amountUSD: fromAmountUSD,
    setAmountUSD: setFromAmountUSD,
    token: fromToken,
    setToken: setFromToken,
    loading: fromLoading,
    setLoading: setFromLoading,
    error: fromTokenBalanceError
  });
  const to = useValue({
    balance: toBalanceString,
    balanceResponse: toTokenResponse,
    amount: toAmount,
    amountUSD: toAmountUSD,
    setAmountUSD: setToAmountUSD,
    setAmount: setToAmount,
    token: toToken,
    setToken: setToToken,
    loading: toLoading,
    setLoading: setToLoading,
    error: toTokenBalanceError
  });
  return {
    from,
    to
  };
}, "useFromTo");

// src/swap/hooks/useLifecycleStatus.ts
import { useCallback as useCallback6, useState as useState7 } from "react";
function useLifecycleStatus(initialState) {
  const [lifecycleStatus, setLifecycleStatus] = useState7(initialState);
  const updateLifecycleStatus = useCallback6((newStatus) => {
    setLifecycleStatus((prevStatus) => {
      const persistedStatusData = prevStatus.statusName === "error" ? (({ error, code, message, ...statusData }) => statusData)(prevStatus.statusData) : prevStatus.statusData;
      return {
        statusName: newStatus.statusName,
        statusData: {
          ...persistedStatusData,
          ...newStatus.statusData
        }
      };
    });
  }, []);
  return [
    lifecycleStatus,
    updateLifecycleStatus
  ];
}
__name(useLifecycleStatus, "useLifecycleStatus");

// src/swap/hooks/useResetInputs.ts
import { useCallback as useCallback7 } from "react";
var useResetInputs = /* @__PURE__ */ __name(({ from, to }) => {
  return useCallback7(async () => {
    await Promise.all([
      from.balanceResponse?.refetch(),
      to.balanceResponse?.refetch(),
      from.setAmount(""),
      from.setAmountUSD(""),
      to.setAmount(""),
      to.setAmountUSD("")
    ]);
  }, [
    from,
    to
  ]);
}, "useResetInputs");

// src/swap/utils/isSwapError.ts
function isSwapError(response) {
  return response !== null && typeof response === "object" && "error" in response;
}
__name(isSwapError, "isSwapError");

// src/swap/utils/processSwapTransaction.ts
import { encodeFunctionData, parseAbi } from "viem";
import { base } from "viem/chains";

// src/constants.ts
var Capabilities = /* @__PURE__ */ function(Capabilities2) {
  Capabilities2["AtomicBatch"] = "atomicBatch";
  Capabilities2["AuxiliaryFunds"] = "auxiliaryFunds";
  Capabilities2["PaymasterService"] = "paymasterService";
  return Capabilities2;
}({});

// src/swap/utils/sendSingleTransactions.ts
import { waitForTransactionReceipt as waitForTransactionReceipt2 } from "wagmi/actions";
async function sendSingleTransactions({ config, sendTransactionAsync, transactions, updateLifecycleStatus }) {
  let transactionReceipt;
  for (const { transaction, transactionType } of transactions) {
    updateLifecycleStatus({
      statusName: "transactionPending"
    });
    const txHash = await sendTransactionAsync(transaction);
    updateLifecycleStatus({
      statusName: "transactionApproved",
      statusData: {
        transactionHash: txHash,
        transactionType
      }
    });
    transactionReceipt = await waitForTransactionReceipt2(config, {
      hash: txHash,
      confirmations: 1
    });
  }
  if (transactionReceipt) {
    updateLifecycleStatus({
      statusName: "success",
      statusData: {
        transactionReceipt
      }
    });
  }
}
__name(sendSingleTransactions, "sendSingleTransactions");

// src/swap/utils/sendSwapTransactions.ts
async function sendSwapTransactions({ config, isSponsored, paymaster, sendCallsAsync, sendTransactionAsync, updateLifecycleStatus, walletCapabilities, transactions }) {
  if (walletCapabilities[Capabilities.AtomicBatch]?.supported) {
    updateLifecycleStatus({
      statusName: "transactionPending"
    });
    const callsId = await sendCallsAsync({
      calls: transactions.map(({ transaction }) => transaction),
      capabilities: isSponsored ? {
        paymasterService: {
          url: paymaster
        }
      } : {}
    });
    updateLifecycleStatus({
      statusName: "transactionApproved",
      statusData: {
        callsId,
        transactionType: "Batched"
      }
    });
  } else {
    await sendSingleTransactions({
      config,
      sendTransactionAsync,
      transactions,
      updateLifecycleStatus
    });
  }
}
__name(sendSwapTransactions, "sendSwapTransactions");

// src/swap/utils/processSwapTransaction.ts
async function processSwapTransaction({ chainId, config, isSponsored, paymaster, sendCallsAsync, sendTransactionAsync, swapTransaction, switchChainAsync, updateLifecycleStatus, useAggregator, walletCapabilities }) {
  const { transaction, approveTransaction, quote } = swapTransaction;
  const transactions = [];
  if (approveTransaction?.data) {
    transactions.push({
      transaction: {
        to: approveTransaction.to,
        value: approveTransaction.value,
        data: approveTransaction.data
      },
      transactionType: "ERC20"
    });
    if (!useAggregator) {
      const permit2ContractAbi = parseAbi([
        "function approve(address token, address spender, uint160 amount, uint48 expiration) external"
      ]);
      const data = encodeFunctionData({
        abi: permit2ContractAbi,
        functionName: "approve",
        args: [
          quote.from.address,
          UNIVERSALROUTER_CONTRACT_ADDRESS,
          BigInt(quote.fromAmount),
          2e13
        ]
      });
      transactions.push({
        transaction: {
          to: PERMIT2_CONTRACT_ADDRESS,
          value: 0n,
          data
        },
        transactionType: "Permit2"
      });
    }
  }
  transactions.push({
    transaction: {
      to: transaction.to,
      value: transaction.value,
      data: transaction.data
    },
    transactionType: "Swap"
  });
  if (chainId !== base.id) {
    await switchChainAsync({
      chainId: base.id
    });
  }
  await sendSwapTransactions({
    config,
    isSponsored,
    paymaster,
    sendCallsAsync,
    sendTransactionAsync,
    transactions,
    updateLifecycleStatus,
    walletCapabilities
  });
}
__name(processSwapTransaction, "processSwapTransaction");

// src/swap/components/SwapProvider.tsx
var emptyContext = {};
var SwapContext = /* @__PURE__ */ createContext2(emptyContext);
function useSwapContext() {
  const context = useContext2(SwapContext);
  if (context === emptyContext) {
    throw new Error("useSwapContext must be used within a Swap component");
  }
  return context;
}
__name(useSwapContext, "useSwapContext");
function SwapProvider({ children, config = {
  maxSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE
}, experimental, isSponsored, onError, onStatus, onSuccess }) {
  const { config: { paymaster } = {
    paymaster: void 0
  } } = useOnchainKit();
  const { address, chainId } = useAccount2();
  const { switchChainAsync } = useSwitchChain();
  const { useAggregator } = experimental;
  const accountConfig = useConfig();
  const walletCapabilities = useCapabilitiesSafe({
    chainId: base2.id
  });
  const [lifecycleStatus, updateLifecycleStatus] = useLifecycleStatus({
    statusName: "init",
    statusData: {
      isMissingRequiredField: true,
      maxSlippage: config.maxSlippage
    }
  });
  const [isToastVisible, setIsToastVisible] = useState8(false);
  const [transactionHash, setTransactionHash] = useState8("");
  const [hasHandledSuccess, setHasHandledSuccess] = useState8(false);
  const { from, to } = useFromTo(address);
  const { sendTransactionAsync } = useSendTransaction();
  const { sendCallsAsync } = useSendCalls();
  const resetInputs = useResetInputs({
    from,
    to
  });
  const awaitCallsStatus = useAwaitCalls({
    accountConfig,
    lifecycleStatus,
    updateLifecycleStatus
  });
  useEffect5(() => {
    if (lifecycleStatus.statusName === "error") {
      onError?.(lifecycleStatus.statusData);
    }
    if (lifecycleStatus.statusName === "success") {
      onSuccess?.(lifecycleStatus.statusData.transactionReceipt);
      setTransactionHash(lifecycleStatus.statusData.transactionReceipt?.transactionHash);
      setHasHandledSuccess(true);
      setIsToastVisible(true);
    }
    onStatus?.(lifecycleStatus);
  }, [
    onError,
    onStatus,
    onSuccess,
    lifecycleStatus,
    lifecycleStatus.statusData,
    lifecycleStatus.statusName
  ]);
  useEffect5(() => {
    if (lifecycleStatus.statusName === "init" && hasHandledSuccess) {
      setHasHandledSuccess(false);
      resetInputs();
    }
  }, [
    hasHandledSuccess,
    lifecycleStatus.statusName,
    resetInputs
  ]);
  useEffect5(() => {
    if (lifecycleStatus.statusName === "transactionApproved" && lifecycleStatus.statusData.transactionType === "Batched") {
      awaitCallsStatus();
    }
  }, [
    awaitCallsStatus,
    lifecycleStatus,
    lifecycleStatus.statusData,
    lifecycleStatus.statusName
  ]);
  useEffect5(() => {
    if (lifecycleStatus.statusName === "success" && hasHandledSuccess) {
      updateLifecycleStatus({
        statusName: "init",
        statusData: {
          isMissingRequiredField: true,
          maxSlippage: config.maxSlippage
        }
      });
    }
  }, [
    config.maxSlippage,
    hasHandledSuccess,
    lifecycleStatus.statusName,
    updateLifecycleStatus
  ]);
  const handleToggle = useCallback8(() => {
    from.setAmount(to.amount);
    to.setAmount(from.amount);
    from.setToken(to.token);
    to.setToken(from.token);
    updateLifecycleStatus({
      statusName: "amountChange",
      statusData: {
        amountFrom: from.amount,
        amountTo: to.amount,
        tokenFrom: from.token,
        tokenTo: to.token,
        // token is missing
        isMissingRequiredField: !from.token || !to.token || !from.amount || !to.amount
      }
    });
  }, [
    from,
    to,
    updateLifecycleStatus
  ]);
  const handleAmountChange = useCallback8(async (type, amount, sToken, dToken) => {
    const source = type === "from" ? from : to;
    const destination = type === "from" ? to : from;
    source.token = sToken ?? source.token;
    destination.token = dToken ?? destination.token;
    if (source.token === void 0 || destination.token === void 0) {
      updateLifecycleStatus({
        statusName: "amountChange",
        statusData: {
          amountFrom: from.amount,
          amountTo: to.amount,
          tokenFrom: from.token,
          tokenTo: to.token,
          // token is missing
          isMissingRequiredField: true
        }
      });
      return;
    }
    if (amount === "" || amount === "." || Number.parseFloat(amount) === 0) {
      destination.setAmount("");
      destination.setAmountUSD("");
      source.setAmountUSD("");
      return;
    }
    destination.setLoading(true);
    updateLifecycleStatus({
      statusName: "amountChange",
      statusData: {
        // when fetching quote, the previous
        // amount is irrelevant
        amountFrom: type === "from" ? amount : "",
        amountTo: type === "to" ? amount : "",
        tokenFrom: from.token,
        tokenTo: to.token,
        // when fetching quote, the destination
        // amount is missing
        isMissingRequiredField: true
      }
    });
    try {
      const maxSlippage = lifecycleStatus.statusData.maxSlippage;
      const response = await getSwapQuote({
        amount,
        amountReference: "from",
        from: source.token,
        maxSlippage: String(maxSlippage),
        to: destination.token,
        useAggregator
      });
      if (isSwapError(response)) {
        updateLifecycleStatus({
          statusName: "error",
          statusData: {
            code: response.code,
            error: response.error,
            message: ""
          }
        });
        return;
      }
      const formattedAmount = formatTokenAmount(response.toAmount, response.to.decimals);
      destination.setAmountUSD(response.toAmountUSD);
      destination.setAmount(formattedAmount);
      source.setAmountUSD(response.fromAmountUSD);
      updateLifecycleStatus({
        statusName: "amountChange",
        statusData: {
          amountFrom: type === "from" ? amount : formattedAmount,
          amountTo: type === "to" ? amount : formattedAmount,
          tokenFrom: from.token,
          tokenTo: to.token,
          // if quote was fetched successfully, we
          // have all required fields
          isMissingRequiredField: !formattedAmount
        }
      });
    } catch (err) {
      updateLifecycleStatus({
        statusName: "error",
        statusData: {
          code: "TmSPc01",
          error: JSON.stringify(err),
          message: ""
        }
      });
    } finally {
      destination.setLoading(false);
    }
  }, [
    from,
    to,
    lifecycleStatus,
    updateLifecycleStatus,
    useAggregator
  ]);
  const handleSubmit = useCallback8(async () => {
    if (!address || !from.token || !to.token || !from.amount) {
      return;
    }
    try {
      const maxSlippage = lifecycleStatus.statusData.maxSlippage;
      const response = await buildSwapTransaction({
        amount: from.amount,
        fromAddress: address,
        from: from.token,
        maxSlippage: String(maxSlippage),
        to: to.token,
        useAggregator
      });
      if (isSwapError(response)) {
        updateLifecycleStatus({
          statusName: "error",
          statusData: {
            code: response.code,
            error: response.error,
            message: response.message
          }
        });
        return;
      }
      await processSwapTransaction({
        chainId,
        config: accountConfig,
        isSponsored,
        paymaster: paymaster || "",
        sendCallsAsync,
        sendTransactionAsync,
        swapTransaction: response,
        switchChainAsync,
        updateLifecycleStatus,
        useAggregator,
        walletCapabilities
      });
    } catch (err) {
      const errorMessage = isUserRejectedRequestError(err) ? "Request denied." : GENERIC_ERROR_MESSAGE;
      updateLifecycleStatus({
        statusName: "error",
        statusData: {
          code: "TmSPc02",
          error: JSON.stringify(err),
          message: errorMessage
        }
      });
    }
  }, [
    accountConfig,
    address,
    chainId,
    from.amount,
    from.token,
    isSponsored,
    lifecycleStatus,
    paymaster,
    sendCallsAsync,
    sendTransactionAsync,
    switchChainAsync,
    to.token,
    updateLifecycleStatus,
    useAggregator,
    walletCapabilities
  ]);
  const value = useValue({
    address,
    config,
    from,
    handleAmountChange,
    handleToggle,
    handleSubmit,
    lifecycleStatus,
    updateLifecycleStatus,
    to,
    isToastVisible,
    setIsToastVisible,
    setTransactionHash,
    transactionHash
  });
  return /* @__PURE__ */ React.createElement(SwapContext.Provider, {
    value
  }, children);
}
__name(SwapProvider, "SwapProvider");

// src/swap/components/SwapAmountInput.tsx
function SwapAmountInput({ className, delayMs = 1e3, label, token, type, swappableTokens }) {
  const { address, to, from, handleAmountChange } = useSwapContext();
  const source = useValue(type === "from" ? from : to);
  const destination = useValue(type === "from" ? to : from);
  useEffect6(() => {
    if (token) {
      source.setToken(token);
    }
  }, [
    token,
    source.setToken
  ]);
  const handleMaxButtonClick = useCallback9(() => {
    if (!source.balance) {
      return;
    }
    source.setAmount(source.balance);
    handleAmountChange(type, source.balance);
  }, [
    source.balance,
    source.setAmount,
    handleAmountChange,
    type
  ]);
  const handleChange = useCallback9((amount) => {
    handleAmountChange(type, amount);
  }, [
    handleAmountChange,
    type
  ]);
  const handleSetToken = useCallback9((token2) => {
    source.setToken(token2);
    handleAmountChange(type, source.amount, token2);
  }, [
    source.amount,
    source.setToken,
    handleAmountChange,
    type
  ]);
  const sourceTokenOptions = useMemo8(() => {
    return swappableTokens?.filter(({ symbol }) => symbol !== destination.token?.symbol) ?? [];
  }, [
    swappableTokens,
    destination.token
  ]);
  const hasInsufficientBalance = type === "from" && Number(source.balance) < Number(source.amount);
  const formatUSD = /* @__PURE__ */ __name((amount) => {
    if (!amount || amount === "0") {
      return null;
    }
    const roundedAmount = Number(getRoundedAmount(amount, 2));
    return `~$${roundedAmount.toFixed(2)}`;
  }, "formatUSD");
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(background.secondary, border.radius, "box-border flex h-[148px] w-full flex-col items-start p-4", className),
    "data-testid": "ockSwapAmountInput_Container"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex w-full items-center justify-between"
  }, /* @__PURE__ */ React.createElement("span", {
    className: cn(text.label2, color.foregroundMuted)
  }, label)), /* @__PURE__ */ React.createElement("div", {
    className: "flex w-full items-center justify-between"
  }, /* @__PURE__ */ React.createElement(TextInput, {
    className: cn("mr-2 w-full border-[none] bg-transparent font-display text-[2.5rem]", "leading-none outline-none", hasInsufficientBalance && address ? color.error : color.foreground),
    placeholder: "0.0",
    delayMs,
    value: formatAmount2(source.amount),
    setValue: source.setAmount,
    disabled: source.loading,
    onChange: handleChange,
    inputValidator: isValidAmount
  }), sourceTokenOptions.length > 0 ? /* @__PURE__ */ React.createElement(TokenSelectDropdown, {
    token: source.token,
    setToken: handleSetToken,
    options: sourceTokenOptions
  }) : source.token && /* @__PURE__ */ React.createElement(TokenChip, {
    className: pressable.inverse,
    token: source.token
  })), /* @__PURE__ */ React.createElement("div", {
    className: "mt-4 flex w-full justify-between"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center"
  }, /* @__PURE__ */ React.createElement("span", {
    className: cn(text.label2, color.foregroundMuted)
  }, formatUSD(source.amountUSD))), /* @__PURE__ */ React.createElement("span", {
    className: cn(text.label2, color.foregroundMuted)
  }, ""), /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center"
  }, source.balance && /* @__PURE__ */ React.createElement("span", {
    className: cn(text.label2, color.foregroundMuted)
  }, `Balance: ${getRoundedAmount(source.balance, 8)}`), type === "from" && address && /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: "flex cursor-pointer items-center justify-center px-2 py-1",
    "data-testid": "ockSwapAmountInput_MaxButton",
    onClick: handleMaxButtonClick
  }, /* @__PURE__ */ React.createElement("span", {
    className: cn(text.label1, color.primary)
  }, "Max")))));
}
__name(SwapAmountInput, "SwapAmountInput");

// src/internal/components/Spinner.tsx
function Spinner({ className }) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex h-full items-center justify-center",
    "data-testid": "ockSpinner"
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn("animate-spin border-2 border-gray-200 border-t-3", "rounded-full border-t-gray-400 px-2.5 py-2.5", className)
  }));
}
__name(Spinner, "Spinner");

// src/wallet/components/ConnectWallet.tsx
import { ConnectButton as ConnectButtonRainbowKit } from "@rainbow-me/rainbowkit";
import { Children, isValidElement as isValidElement2, useCallback as useCallback10, useMemo as useMemo9 } from "react";
import { useAccount as useAccount3, useConnect } from "wagmi";

// src/identity/components/IdentityProvider.tsx
import { createContext as createContext3, useContext as useContext3 } from "react";
var emptyContext2 = {};
var IdentityContext = /* @__PURE__ */ createContext3(emptyContext2);
function IdentityProvider(props) {
  const { chain: contextChain } = useOnchainKit();
  const accountChain = props.chain ?? contextChain;
  const value = useValue({
    address: props.address || "",
    chain: accountChain,
    schemaId: props.schemaId
  });
  return /* @__PURE__ */ React.createElement(IdentityContext.Provider, {
    value
  }, props.children);
}
__name(IdentityProvider, "IdentityProvider");

// src/wallet/components/ConnectButton.tsx
function ConnectButton({
  className,
  connectWalletText,
  onClick,
  // Text will be deprecated in the future
  text: text2
}) {
  return /* @__PURE__ */ React.createElement("button", {
    type: "button",
    "data-testid": "ockConnectButton",
    className: cn(pressable.primary, border.radius, text.headline, color.inverse, "inline-flex min-w-[153px] items-center justify-center px-4 py-3", className),
    onClick
  }, connectWalletText ? connectWalletText : /* @__PURE__ */ React.createElement("span", {
    className: cn(color.inverse)
  }, text2));
}
__name(ConnectButton, "ConnectButton");

// src/wallet/components/ConnectWalletText.tsx
function ConnectWalletText({ children, className }) {
  return /* @__PURE__ */ React.createElement("span", {
    className: cn(text.headline, color.inverse, className)
  }, children);
}
__name(ConnectWalletText, "ConnectWalletText");

// src/wallet/components/WalletProvider.tsx
import { createContext as createContext4, useContext as useContext4, useState as useState9 } from "react";
var emptyContext3 = {};
var WalletContext = /* @__PURE__ */ createContext4(emptyContext3);
function useWalletContext() {
  return useContext4(WalletContext);
}
__name(useWalletContext, "useWalletContext");

// src/wallet/components/ConnectWallet.tsx
function ConnectWallet({
  children,
  className,
  // In a few version we will officially deprecate this prop,
  // but for now we will keep it for backward compatibility.
  text: text2 = "Connect Wallet",
  withWalletAggregator = false
}) {
  const { isOpen, setIsOpen } = useWalletContext();
  const { address: accountAddress, status } = useAccount3();
  const { connectors, connect, status: connectStatus } = useConnect();
  const { connectWalletText } = useMemo9(() => {
    const childrenArray = Children.toArray(children);
    return {
      connectWalletText: childrenArray.find(findComponent(ConnectWalletText))
    };
  }, [
    children
  ]);
  const childrenWithoutConnectWalletText = useMemo9(() => {
    return Children.map(children, (child) => {
      if (/* @__PURE__ */ isValidElement2(child) && child.type === ConnectWalletText) {
        return null;
      }
      return child;
    });
  }, [
    children
  ]);
  const connector = connectors[0];
  const isLoading = connectStatus === "pending" || status === "connecting";
  const handleToggle = useCallback10(() => {
    setIsOpen(!isOpen);
  }, [
    isOpen,
    setIsOpen
  ]);
  console.log("demo Noegf");
  if (status === "disconnected") {
    if (withWalletAggregator) {
      return /* @__PURE__ */ React.createElement(ConnectButtonRainbowKit.Custom, null, ({ openConnectModal }) => /* @__PURE__ */ React.createElement("div", {
        className: "flex",
        "data-testid": "ockConnectWallet_Container"
      }, /* @__PURE__ */ React.createElement(ConnectButton, {
        className,
        connectWalletText,
        onClick: /* @__PURE__ */ __name(() => openConnectModal(), "onClick"),
        text: text2
      })));
    }
    return /* @__PURE__ */ React.createElement("div", {
      className: "flex",
      "data-testid": "ockConnectWallet_Container"
    }, /* @__PURE__ */ React.createElement(ConnectButton, {
      className,
      connectWalletText,
      onClick: /* @__PURE__ */ __name(() => connect({
        connector
      }), "onClick"),
      text: text2
    }));
  }
  if (isLoading) {
    return /* @__PURE__ */ React.createElement("div", {
      className: "flex",
      "data-testid": "ockConnectWallet_Container"
    }, /* @__PURE__ */ React.createElement("button", {
      type: "button",
      "data-testid": "ockConnectAccountButtonInner",
      className: cn(pressable.primary, text.headline, color.inverse, "inline-flex min-w-[153px] items-center justify-center rounded-xl px-4 py-3", pressable.disabled, className),
      disabled: true
    }, /* @__PURE__ */ React.createElement(Spinner, null)));
  }
  return /* @__PURE__ */ React.createElement(IdentityProvider, {
    address: accountAddress
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex gap-4",
    "data-testid": "ockConnectWallet_Container"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "button",
    "data-testid": "ockConnectWallet_Connected",
    className: cn(pressable.secondary, border.radius, color.foreground, "px-4 py-3", isOpen && "ock-bg-secondary-active hover:ock-bg-secondary-active", className),
    onClick: handleToggle
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex gap-2"
  }, childrenWithoutConnectWalletText))));
}
__name(ConnectWallet, "ConnectWallet");

// src/wallet/components/Wallet.tsx
import { Children as Children7, useEffect as useEffect10, useMemo as useMemo15, useRef as useRef4 } from "react";

// src/wallet/components/WalletDropdown.tsx
import { Children as Children6, cloneElement as cloneElement2, isValidElement as isValidElement4, useMemo as useMemo14 } from "react";
import { useAccount as useAccount5 } from "wagmi";

// src/identity/components/Identity.tsx
import { useCallback as useCallback12 } from "react";

// src/identity/components/IdentityLayout.tsx
import { Children as Children4, useMemo as useMemo12 } from "react";

// src/identity/hooks/usePopover.ts
import { useCallback as useCallback11, useEffect as useEffect7, useState as useState10 } from "react";

// src/identity/components/Address.tsx
import { useState as useState11 } from "react";

// src/identity/components/Avatar.tsx
import { Children as Children2, useMemo as useMemo10 } from "react";

// src/internal/svg/defaultAvatarSVG.tsx
var defaultAvatarSVG = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-defaultAvatarSVG",
  role: "img",
  "aria-label": "ock-defaultAvatarSVG",
  width: "100%",
  height: "100%",
  viewBox: "0 0 40 40",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  className: "h-full w-full"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20C40 31.0457 31.0457 40 20 40ZM25.6641 13.9974C25.6641 10.8692 23.1282 8.33333 20.0001 8.33333C16.8719 8.33333 14.336 10.8692 14.336 13.9974C14.336 17.1256 16.8719 19.6615 20.0001 19.6615C23.1282 19.6615 25.6641 17.1256 25.6641 13.9974ZM11.3453 23.362L9.53476 28.1875C12.2141 30.8475 15.9019 32.493 19.974 32.5H20.026C24.0981 32.493 27.7859 30.8475 30.4653 28.1874L28.6547 23.362C28.0052 21.625 26.3589 20.4771 24.5162 20.4318C24.4557 20.4771 22.462 21.9271 20 21.9271C17.538 21.9271 15.5443 20.4771 15.4839 20.4318C13.6412 20.462 11.9948 21.625 11.3453 23.362Z",
  className: icon.foreground
}));

// src/identity/hooks/useAvatar.ts
import { useQuery } from "@tanstack/react-query";
import { mainnet as mainnet3 } from "viem/chains";

// src/identity/utils/getAvatar.ts
import { mainnet as mainnet2 } from "viem/chains";
import { normalize } from "viem/ens";

// src/isBase.ts
import { base as base3, baseSepolia as baseSepolia2 } from "viem/chains";

// src/isEthereum.ts
import { mainnet, sepolia } from "viem/chains";

// src/network/getChainPublicClient.ts
import { http, createPublicClient } from "viem";

// src/identity/constants.ts
import { base as base4, baseSepolia as baseSepolia3 } from "viem/chains";
var RESOLVER_ADDRESSES_BY_CHAIN_ID = {
  [baseSepolia3.id]: "0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA",
  [base4.id]: "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD"
};

// src/identity/utils/getBaseDefaultProfilePictureIndex.tsx
import { sha256 } from "viem";

// src/identity/hooks/useName.ts
import { useQuery as useQuery2 } from "@tanstack/react-query";
import { mainnet as mainnet6 } from "viem/chains";

// src/identity/utils/getName.ts
import { base as base5, mainnet as mainnet5 } from "viem/chains";

// src/identity/utils/convertReverseNodeToBytes.ts
import { encodePacked, keccak256, namehash } from "viem";

// src/identity/utils/convertChainIdToCoinType.ts
import { mainnet as mainnet4 } from "viem/chains";

// src/internal/svg/badgeSvg.tsx
var badgeSvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-badgeSvg",
  width: "12",
  height: "12",
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  className: "h-full w-full"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M8.12957 3.73002L5.11957 6.74002L3.77957 5.40002C3.49957 5.12002 3.04957 5.12002 2.76957 5.40002C2.48957 5.68002 2.48957 6.13002 2.76957 6.41002L4.10957 7.75002L4.59957 8.24002C4.90957 8.55002 5.41957 8.55002 5.72957 8.24002L9.17957 4.79002C9.45957 4.51002 9.45957 4.06002 9.17957 3.78002L9.12957 3.73002C8.84957 3.45002 8.39957 3.45002 8.11957 3.73002H8.12957Z",
  "data-testid": "ock-badgeSvg",
  className: icon.foreground
}));

// src/identity/hooks/useAttestations.ts
import { useEffect as useEffect8, useState as useState12 } from "react";

// src/network/attestations.ts
import { gql } from "graphql-request";
import { getAddress } from "viem";

// src/network/createEasGraphQLClient.ts
import { GraphQLClient } from "graphql-request";

// src/network/definitions/base.ts
import { base as base6 } from "viem/chains";
var easChainBase = {
  id: base6.id,
  easGraphqlAPI: "https://base.easscan.org/graphql",
  schemaUids: [
    // VERIFIED_COUNTRY
    // https://base.easscan.org/schema/view/0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065
    "0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065",
    // VERIFIED_ACCOUNT
    // https://base.easscan.org/schema/view/0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9
    "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
  ]
};

// src/network/definitions/baseSepolia.ts
import { baseSepolia as baseSepolia4 } from "viem/chains";
var easChainBaseSepolia = {
  id: baseSepolia4.id,
  easGraphqlAPI: "https://base-sepolia.easscan.org/graphql",
  schemaUids: [
    // VERIFIED_COUNTRY
    // https://base-sepolia.easscan.org/schema/view/0xef54ae90f47a187acc050ce631c55584fd4273c0ca9456ab21750921c3a84028
    "0xef54ae90f47a187acc050ce631c55584fd4273c0ca9456ab21750921c3a84028",
    // VERIFIED_ACCOUNT
    // https://base-sepolia.easscan.org/schema/view/0x2f34a2ffe5f87b2f45fbc7c784896b768d77261e2f24f77341ae43751c765a69
    "0x2f34a2ffe5f87b2f45fbc7c784896b768d77261e2f24f77341ae43751c765a69"
  ]
};

// src/network/definitions/optimism.ts
import { optimism } from "viem/chains";
var easChainOptimism = {
  id: optimism.id,
  easGraphqlAPI: "https://optimism.easscan.org/graphql",
  schemaUids: [
    // N_A
    // https://optimism.easscan.org/schema/view/0xac4c92fc5c7babed88f78a917cdbcdc1c496a8f4ab2d5b2ec29402736b2cf929
    "0xac4c92fc5c7babed88f78a917cdbcdc1c496a8f4ab2d5b2ec29402736b2cf929",
    // GITCOIN_PASSPORT_SCORES_V1:
    // https://optimism.easscan.org/schema/view/0x6ab5d34260fca0cfcf0e76e96d439cace6aa7c3c019d7c4580ed52c6845e9c89
    "0x6ab5d34260fca0cfcf0e76e96d439cace6aa7c3c019d7c4580ed52c6845e9c89",
    // OPTIMISM_GOVERNANCE_SEASON_4_CO_GRANT_PARTICIPANT:
    // https://optimism.easscan.org/schema/view/0x401a80196f3805c57b00482ae2b575a9f270562b6b6de7711af9837f08fa0faf
    "0x401a80196f3805c57b00482ae2b575a9f270562b6b6de7711af9837f08fa0faf"
  ]
};

// src/identity/utils/easSupportedChains.ts
var easSupportedChains = {
  [easChainBase.id]: easChainBase,
  [easChainBaseSepolia.id]: easChainBaseSepolia,
  [easChainOptimism.id]: easChainOptimism
};

// src/network/attestations.ts
var attestationQuery = gql`
  query AttestationsForUsers(
    $where: AttestationWhereInput
    $distinct: [AttestationScalarFieldEnum!]
    $take: Int
  ) {
    attestations(where: $where, distinct: $distinct, take: $take) {
      id
      txid
      schemaId
      attester
      recipient
      revoked
      revocationTime
      expirationTime
      time
      timeCreated
      decodedDataJson
    }
  }
`;

// src/identity/components/Name.tsx
import { Children as Children3, useMemo as useMemo11 } from "react";

// src/identity/hooks/useSocials.tsx
import { useQuery as useQuery3 } from "@tanstack/react-query";
import { mainnet as mainnet8 } from "viem/chains";

// src/identity/utils/getSocials.ts
import { mainnet as mainnet7 } from "viem/chains";
import { normalize as normalize2 } from "viem/ens";

// src/internal/svg/githubSvg.tsx
var githubSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-githubSvg",
  role: "img",
  "aria-label": "ock-githubSvg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  className: "h-full w-full"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z",
  className: icon.foreground
}));

// src/internal/svg/twitterSvg.tsx
var twitterSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-twitterSvg",
  role: "img",
  "aria-label": "ock-twitterSvg",
  width: "100%",
  height: "100%",
  viewBox: "-1 -1 14 14",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  className: "h-full w-full"
}, /* @__PURE__ */ React.createElement("g", {
  clipPath: "url(#clip0_6998_47)"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M7.14163 5.07857L11.6089 0H10.5503L6.67137 4.40965L3.57328 0H0L4.68492 6.66817L0 11.9938H1.05866L5.15491 7.33709L8.42672 11.9938H12L7.14137 5.07857H7.14163ZM5.69165 6.72692L5.21697 6.06292L1.44011 0.779407H3.06615L6.11412 5.04337L6.5888 5.70737L10.5508 11.2499H8.92476L5.69165 6.72718V6.72692Z",
  className: icon.foreground
})), /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("clipPath", {
  id: "clip0_6998_47"
}, /* @__PURE__ */ React.createElement("rect", {
  width: "12",
  height: "12",
  fill: "white"
}))));

// src/internal/svg/warpcastSvg.tsx
var warpcastSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-warpcastSvg",
  role: "img",
  "aria-label": "ock-warpcastSvg",
  width: "100%",
  height: "100%",
  viewBox: "9 9 14 14",
  xmlns: "http://www.w3.org/2000/svg",
  className: `h-full w-full ${icon.foreground}`
}, /* @__PURE__ */ React.createElement("path", {
  d: "M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z",
  className: icon.inverse
}), /* @__PURE__ */ React.createElement("path", {
  d: "M11.7305 10H20.115V22H18.8843V16.5032H18.8722C18.7362 14.984 17.4676 13.7935 15.9227 13.7935C14.3779 13.7935 13.1093 14.984 12.9733 16.5032H12.9612V22H11.7305V10Z",
  className: icon.foreground
}), /* @__PURE__ */ React.createElement("path", {
  d: "M9.5 11.7031L10 13.4064H10.4231V20.2967C10.2106 20.2967 10.0385 20.47 10.0385 20.6838V21.1483H9.96154C9.74913 21.1483 9.57691 21.3216 9.57691 21.5354V21.9999H13.8846V21.5354C13.8846 21.3216 13.7124 21.1483 13.5 21.1483H13.4231V20.6838C13.4231 20.47 13.2508 20.2967 13.0384 20.2967H12.5769V11.7031H9.5Z",
  className: icon.foreground
}), /* @__PURE__ */ React.createElement("path", {
  d: "M18.9614 20.2967C18.749 20.2967 18.5768 20.47 18.5768 20.6838V21.1483H18.4998C18.2874 21.1483 18.1152 21.3216 18.1152 21.5354V21.9999H22.4229V21.5354C22.4229 21.3216 22.2507 21.1483 22.0383 21.1483H21.9614V20.6838C21.9614 20.47 21.7892 20.2967 21.5768 20.2967V13.4064H21.9998L22.4998 11.7031H19.4229V20.2967H18.9614Z",
  className: icon.foreground
}));

// src/internal/svg/websiteSvg.tsx
var websiteSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-websiteSvg",
  role: "img",
  "aria-label": "ock-websiteSvg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 12 12",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  className: `h-full w-full ${icon.foreground}`
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M6 0C9.31356 0 12 2.68644 12 6C12 9.31356 9.31356 12 6 12C2.69689 12 0.0245556 9.35356 0 6C0.0244789 2.64689 2.69689 0 6 0ZM9.34844 9.97867C9.15053 9.88544 8.9422 9.80002 8.72553 9.72346C8.56251 10.0854 8.36772 10.4313 8.13856 10.7412C8.57762 10.5427 8.98439 10.2854 9.34844 9.97867ZM7.95156 9.49742C7.46353 9.38284 6.9427 9.30992 6.4 9.28597V11.1381C7.04791 10.9365 7.58233 10.2766 7.95156 9.49742ZM5.6 9.28597C5.05729 9.30993 4.53646 9.38284 4.04844 9.49742C4.41771 10.2766 4.95209 10.936 5.6 11.1375V9.28597ZM3.27456 9.72347C3.05737 9.80003 2.84956 9.88544 2.65164 9.97868C3.01571 10.2854 3.42248 10.5427 3.86153 10.7412C3.63237 10.4313 3.43758 10.0854 3.27456 9.72347ZM2.05267 9.38492C2.34486 9.2318 2.65736 9.09534 2.98809 8.97763C2.73913 8.21044 2.58288 7.33386 2.54799 6.40008H0.815211C0.901669 7.53597 1.35323 8.5703 2.05277 9.38497L2.05267 9.38492ZM3.75156 8.74742C4.33229 8.60263 4.95367 8.512 5.6 8.48545V6.4H3.34844C3.3823 7.25677 3.52553 8.05522 3.75157 8.74733L3.75156 8.74742ZM6.4 8.48545C7.04636 8.51201 7.66767 8.60263 8.24844 8.74794C8.47449 8.05523 8.61771 7.25728 8.65157 6.40061L6.40001 6.40009L6.4 8.48545ZM9.012 8.97763C9.34273 9.09534 9.65576 9.2318 9.94742 9.38492C10.6469 8.56982 11.0984 7.53603 11.185 6.40003H9.4522C9.4173 7.33389 9.26106 8.21048 9.0121 8.97759L9.012 8.97763ZM9.94742 2.61508C9.65523 2.7682 9.34273 2.90466 9.012 3.02237C9.26096 3.78956 9.41721 4.66614 9.4521 5.59992H11.1849C11.0984 4.46403 10.6469 3.4297 9.94732 2.61503L9.94742 2.61508ZM8.24853 3.25258C7.6678 3.39737 7.04642 3.488 6.40009 3.51456V5.6H8.65164C8.61779 4.74323 8.47456 3.94478 8.24852 3.25267L8.24853 3.25258ZM5.60009 3.51456C4.95373 3.48799 4.33242 3.39737 3.75164 3.25206C3.5256 3.94477 3.38238 4.74328 3.34852 5.59994H5.60008L5.60009 3.51456ZM2.98809 3.02237C2.65736 2.90466 2.34433 2.7682 2.05267 2.61508C1.35319 3.43018 0.901667 4.46397 0.815111 5.59997H2.54789C2.58278 4.66611 2.73903 3.78952 2.98799 3.02241L2.98809 3.02237ZM2.65163 2.02132C2.84954 2.11455 3.05788 2.19997 3.27454 2.27653C3.43757 1.91456 3.63236 1.56872 3.86152 1.25882C3.42246 1.45726 3.01569 1.71456 2.65163 2.02132ZM4.04852 2.50257C4.53654 2.61714 5.05738 2.69007 5.60008 2.71402V0.861911C4.95217 1.06348 4.41774 1.72337 4.04852 2.50258V2.50257ZM6.40008 2.71402C6.94279 2.69006 7.46362 2.61715 7.95163 2.50257C7.58237 1.7234 7.04747 1.06346 6.40008 0.8619V2.71402ZM8.72552 2.27652C8.94271 2.19996 9.15052 2.11454 9.34843 2.02131C8.98437 1.71454 8.5776 1.45724 8.13855 1.25881C8.36771 1.56923 8.5625 1.91454 8.72552 2.27652Z"
}));

// src/useBreakpoints.ts
import { useEffect as useEffect9, useState as useState13 } from "react";
var BREAKPOINTS = {
  sm: "(max-width: 640px)",
  md: "(min-width: 641px) and (max-width: 768px)",
  lg: "(min-width: 769px) and (max-width: 1023px)",
  xl: "(min-width: 1024px) and (max-width: 1279px)",
  "2xl": "(min-width: 1280px)"
};
function useBreakpoints() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState13(void 0);
  useEffect9(() => {
    const getCurrentBreakpoint = /* @__PURE__ */ __name(() => {
      const entries = Object.entries(BREAKPOINTS);
      for (const [key, query] of entries) {
        if (window.matchMedia(query).matches) {
          return key;
        }
      }
      return "md";
    }, "getCurrentBreakpoint");
    setCurrentBreakpoint(getCurrentBreakpoint());
    const handleResize = /* @__PURE__ */ __name(() => {
      setCurrentBreakpoint(getCurrentBreakpoint());
    }, "handleResize");
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return currentBreakpoint;
}
__name(useBreakpoints, "useBreakpoints");

// src/wallet/components/WalletBottomSheet.tsx
import { Children as Children5, cloneElement, isValidElement as isValidElement3, useCallback as useCallback13, useMemo as useMemo13 } from "react";
import { useAccount as useAccount4 } from "wagmi";

// src/identity/utils/getAddress.ts
import { mainnet as mainnet9 } from "viem/chains";

// src/identity/hooks/useAddress.ts
import { useQuery as useQuery4 } from "@tanstack/react-query";
import { mainnet as mainnet10 } from "viem/chains";

// src/wallet/components/WalletDropdownDisconnect.tsx
import { useCallback as useCallback14 } from "react";
import { useDisconnect } from "wagmi";

// src/internal/svg/disconnectSvg.tsx
var disconnectSvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-disconnect-svg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 16 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M11.0668 0.91803L11.0668 2.93852L2.02049 2.93852L2.02049 15.0615L11.0668 15.0615L11.0668 17.082L-7.06549e-07 17.082L0 0.918029L11.0668 0.91803Z",
  className: icon.foreground
}), /* @__PURE__ */ React.createElement("path", {
  d: "M12.3273 12.8963L16.0002 9.02606L12.346 4.95902L10.843 6.30941L12.3623 8.00032L5.53321 8.00032L5.53321 10.0208L12.2706 10.0208L10.8617 11.5054L12.3273 12.8963Z",
  className: icon.foreground
}));

// src/internal/hooks/useIcon.tsx
import { isValidElement as isValidElement5, useMemo as useMemo16 } from "react";

// src/internal/svg/coinbasePaySvg.tsx
var coinbasePaySvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-coinbasePaySvg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M10.0145 14.1666C7.82346 14.1666 6.04878 12.302 6.04878 9.99996C6.04878 7.69788 7.82346 5.83329 10.0145 5.83329C11.9776 5.83329 13.6069 7.33677 13.9208 9.30552H17.9163C17.5793 5.02774 14.172 1.66663 10.0145 1.66663C5.63568 1.66663 2.08301 5.39926 2.08301 9.99996C2.08301 14.6007 5.63568 18.3333 10.0145 18.3333C14.172 18.3333 17.5793 14.9722 17.9163 10.6944H13.9208C13.6069 12.6632 11.9776 14.1666 10.0145 14.1666Z",
  fill: "#f9fafb"
}));

// src/internal/svg/fundWallet.tsx
var fundWalletSvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-fundWalletSvg",
  width: "18",
  height: "18",
  viewBox: "0 0 18 18",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M13.5 4.5C13.5 6.15685 14.8431 7.5 16.5 7.5V10.5C14.8431 10.5 13.5 11.8431 13.5 13.5H4.5C4.5 11.8431 3.15685 10.5 1.5 10.5L1.5 13.5V7.5C3.15685 7.5 4.5 6.15685 4.5 4.5H13.5ZM0 3V15H18V3H0ZM11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25C10.2426 11.25 11.25 10.2426 11.25 9Z",
  fill: "#0A0B0D",
  className: icon.foreground
}));

// src/internal/svg/swapSettings.tsx
var swapSettingsSvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-swapSettingsSvg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 19 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M8.92071 5.89742e-08C8.00371 5.89742e-08 7.22171 0.663 7.07071 1.567L6.89271 2.639C6.87271 2.759 6.77771 2.899 6.59571 2.987C6.25306 3.15171 5.92344 3.34226 5.60971 3.557C5.44371 3.672 5.27571 3.683 5.15971 3.64L4.14271 3.258C3.72695 3.10224 3.26941 3.09906 2.85152 3.24904C2.43364 3.39901 2.08254 3.69241 1.86071 4.077L0.938708 5.674C0.716797 6.05836 0.638423 6.50897 0.717525 6.94569C0.796628 7.3824 1.02808 7.7769 1.37071 8.059L2.21071 8.751C2.30571 8.829 2.38071 8.98 2.36471 9.181C2.33621 9.56013 2.33621 9.94087 2.36471 10.32C2.37971 10.52 2.30571 10.672 2.21171 10.75L1.37071 11.442C1.02808 11.7241 0.796628 12.1186 0.717525 12.5553C0.638423 12.992 0.716797 13.4426 0.938708 13.827L1.86071 15.424C2.08269 15.8084 2.43387 16.1016 2.85173 16.2514C3.2696 16.4012 3.72706 16.3978 4.14271 16.242L5.16171 15.86C5.27671 15.817 5.44471 15.829 5.61171 15.942C5.92371 16.156 6.25271 16.347 6.59671 16.512C6.77871 16.6 6.87371 16.74 6.89371 16.862L7.07171 17.933C7.22271 18.837 8.00471 19.5 8.92171 19.5H10.7657C11.6817 19.5 12.4647 18.837 12.6157 17.933L12.7937 16.861C12.8137 16.741 12.9077 16.601 13.0907 16.512C13.4347 16.347 13.7637 16.156 14.0757 15.942C14.2427 15.828 14.4107 15.817 14.5257 15.86L15.5457 16.242C15.9612 16.3972 16.4183 16.4001 16.8357 16.2502C17.2532 16.1002 17.6039 15.8071 17.8257 15.423L18.7487 13.826C18.9706 13.4416 19.049 12.991 18.9699 12.5543C18.8908 12.1176 18.6593 11.7231 18.3167 11.441L17.4767 10.749C17.3817 10.671 17.3067 10.52 17.3227 10.319C17.3511 9.93987 17.3511 9.55913 17.3227 9.18C17.3067 8.98 17.3817 8.828 17.4757 8.75L18.3157 8.058C19.0237 7.476 19.2067 6.468 18.7487 5.673L17.8267 4.076C17.6047 3.69159 17.2535 3.3984 16.8357 3.24861C16.4178 3.09883 15.9604 3.10215 15.5447 3.258L14.5247 3.64C14.4107 3.683 14.2427 3.671 14.0757 3.557C13.7623 3.3423 13.433 3.15175 13.0907 2.987C12.9077 2.9 12.8137 2.76 12.7937 2.639L12.6147 1.567C12.5418 1.12906 12.3158 0.731216 11.977 0.444267C11.6383 0.157318 11.2087 -0.00011124 10.7647 5.89742e-08H8.92171H8.92071ZM9.84271 13.5C10.8373 13.5 11.7911 13.1049 12.4944 12.4017C13.1976 11.6984 13.5927 10.7446 13.5927 9.75C13.5927 8.75544 13.1976 7.80161 12.4944 7.09835C11.7911 6.39509 10.8373 6 9.84271 6C8.84815 6 7.89432 6.39509 7.19106 7.09835C6.4878 7.80161 6.09271 8.75544 6.09271 9.75C6.09271 10.7446 6.4878 11.6984 7.19106 12.4017C7.89432 13.1049 8.84815 13.5 9.84271 13.5Z",
  fill: "#6B7280",
  className: icon.foreground
}));

// src/internal/svg/walletSvg.tsx
var walletSvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-walletSvg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M0 10C0 15.5222 4.47778 20 10 20C15.5222 20 20 15.5222 20 10C20 4.47778 15.5222 0 10 0C4.47778 0 0 4.47778 0 10ZM7.44444 6.77778C7.075 6.77778 6.77778 7.075 6.77778 7.44444V12.5556C6.77778 12.925 7.075 13.2222 7.44444 13.2222H12.5556C12.925 13.2222 13.2222 12.925 13.2222 12.5556V7.44444C13.2222 7.075 12.925 6.77778 12.5556 6.77778H7.44444Z",
  className: icon.foreground
}));

// src/internal/hooks/useIcon.tsx
var useIcon = /* @__PURE__ */ __name(({ icon: icon2 }) => {
  return useMemo16(() => {
    if (icon2 === void 0) {
      return null;
    }
    switch (icon2) {
      case "coinbasePay":
        return coinbasePaySvg;
      case "fundWallet":
        return fundWalletSvg;
      case "swapSettings":
        return swapSettingsSvg;
      case "wallet":
        return walletSvg;
    }
    if (/* @__PURE__ */ isValidElement5(icon2)) {
      return icon2;
    }
  }, [
    icon2
  ]);
}, "useIcon");

// src/wallet/components/WalletDropdownBasename.tsx
import { base as base7 } from "viem/chains";
import { useAccount as useAccount6 } from "wagmi";

// src/internal/svg/basenameSvg.tsx
var basenameSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-basenameSvg",
  role: "img",
  "aria-label": "ock-basenameSvg",
  width: "100%",
  height: "100%",
  viewBox: "0 0 20 20",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  className: "h-full w-full"
}, /* @__PURE__ */ React.createElement("g", {
  id: "Icons/User"
}, /* @__PURE__ */ React.createElement("path", {
  id: "Vector",
  d: "M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM12.832 6.9987C12.832 5.43461 11.5641 4.16666 10 4.16666C8.43594 4.16666 7.168 5.43461 7.168 6.9987C7.168 8.56279 8.43594 9.83073 10 9.83073C11.5641 9.83073 12.832 8.56279 12.832 6.9987ZM5.67266 11.6810L4.76738 14.0938C6.10704 15.4238 7.95093 16.2465 9.98699 16.2500L10.0130 16.2500C12.0491 16.2465 13.8930 15.4238 15.2326 14.0938L14.3273 11.6810C14.0026 10.8125 13.1794 10.2385 12.2581 10.2159C12.2279 10.2385 11.2310 10.9635 10.0000 10.9635C8.76903 10.9635 7.77215 10.2385 7.74194 10.2159C6.82059 10.2310 5.9974 10.8125 5.67266 11.6810Z",
  className: icon.foreground
})));

// src/wallet/components/WalletDropdownFundLink.tsx
import { useCallback as useCallback15, useMemo as useMemo18 } from "react";

// src/fund/hooks/useGetFundingUrl.ts
import { useMemo as useMemo17 } from "react";
import { useAccount as useAccount8 } from "wagmi";

// src/wallet/hooks/useIsWalletACoinbaseSmartWallet.ts
import { useAccount as useAccount7 } from "wagmi";

// src/wallet/utils/isValidAAEntrypoint.ts
import { ENTRYPOINT_ADDRESS_V06 } from "permissionless";

// src/wallet/utils/isWalletACoinbaseSmartWallet.ts
import { checksumAddress, decodeAbiParameters } from "viem";

// src/swap/components/SwapButton.tsx
function SwapButton({ className, disabled = false }) {
  const { address, to, from, lifecycleStatus: { statusName }, handleSubmit } = useSwapContext();
  const isLoading = to.loading || from.loading || statusName === "transactionPending" || statusName === "transactionApproved";
  const isDisabled = !from.amount || !from.token || !to.amount || !to.token || disabled || isLoading;
  const isSwapInvalid = to.token?.address === from.token?.address;
  if (!isDisabled && !address) {
    return /* @__PURE__ */ React.createElement(ConnectWallet, {
      className: "mt-4 w-full"
    });
  }
  return /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: cn(background.primary, border.radius, "w-full rounded-xl", "mt-4 px-4 py-3", isDisabled && pressable.disabled, text.headline, className),
    onClick: /* @__PURE__ */ __name(() => handleSubmit(), "onClick"),
    disabled: isDisabled || isSwapInvalid,
    "data-testid": "ockSwapButton_Button"
  }, isLoading ? /* @__PURE__ */ React.createElement(Spinner, null) : /* @__PURE__ */ React.createElement("span", {
    className: cn(text.headline, color.inverse)
  }, "Swap"));
}
__name(SwapButton, "SwapButton");

// src/swap/utils/getErrorMessage.ts
function getErrorMessage(error) {
  if (error.code === TOO_MANY_REQUESTS_ERROR_CODE) {
    return SwapMessage.TOO_MANY_REQUESTS;
  }
  if (error.code === LOW_LIQUIDITY_ERROR_CODE) {
    return SwapMessage.LOW_LIQUIDITY;
  }
  if (error.code === USER_REJECTED_ERROR_CODE) {
    return SwapMessage.USER_REJECTED;
  }
  return error.message;
}
__name(getErrorMessage, "getErrorMessage");

// src/swap/utils/getSwapMessage.ts
function getSwapMessage({ address, from, lifecycleStatus, to }) {
  if (lifecycleStatus.statusName === "error") {
    return getErrorMessage(lifecycleStatus.statusData);
  }
  if (from.error || to.error) {
    return SwapMessage.BALANCE_ERROR;
  }
  if (address && Number(from.balance) < Number(from.amount)) {
    return SwapMessage.INSUFFICIENT_BALANCE;
  }
  if (lifecycleStatus.statusName === "transactionPending") {
    return SwapMessage.CONFIRM_IN_WALLET;
  }
  if (lifecycleStatus.statusName === "transactionApproved") {
    return SwapMessage.SWAP_IN_PROGRESS;
  }
  if (to.loading || from.loading) {
    return SwapMessage.FETCHING_QUOTE;
  }
  if (lifecycleStatus.statusData.isMissingRequiredField) {
    return SwapMessage.INCOMPLETE_FIELD;
  }
  return "";
}
__name(getSwapMessage, "getSwapMessage");

// src/swap/components/SwapMessage.tsx
function SwapMessage2({ className }) {
  const { address, to, from, lifecycleStatus } = useSwapContext();
  const message = getSwapMessage({
    address,
    from,
    lifecycleStatus,
    to
  });
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("flex h-7 pt-2", text.label2, color.foregroundMuted, className),
    "data-testid": "ockSwapMessage_Message"
  }, message);
}
__name(SwapMessage2, "SwapMessage");

// src/swap/components/SwapSettings.tsx
import { useCallback as useCallback17, useEffect as useEffect11, useRef as useRef5, useState as useState15 } from "react";

// src/swap/components/SwapSettingsSlippageLayout.tsx
import { Children as Children8, useMemo as useMemo19 } from "react";

// src/swap/components/SwapSettingsSlippageDescription.tsx
function SwapSettingsSlippageDescription({ children, className }) {
  return /* @__PURE__ */ React.createElement("p", {
    className: cn(text.legal, color.foregroundMuted, "mb-2", className)
  }, children);
}
__name(SwapSettingsSlippageDescription, "SwapSettingsSlippageDescription");

// src/swap/components/SwapSettingsSlippageInput.tsx
import { useCallback as useCallback16, useState as useState14 } from "react";
var SLIPPAGE_SETTINGS = {
  AUTO: "Auto",
  CUSTOM: "Custom"
};
function SwapSettingsSlippageInput({ className }) {
  const { config: { maxSlippage: defaultMaxSlippage }, updateLifecycleStatus, lifecycleStatus } = useSwapContext();
  const [slippageSetting, setSlippageSetting] = useState14(lifecycleStatus.statusData.maxSlippage === defaultMaxSlippage ? SLIPPAGE_SETTINGS.AUTO : SLIPPAGE_SETTINGS.CUSTOM);
  const updateSlippage = useCallback16((newSlippage) => {
    if (newSlippage !== lifecycleStatus.statusData.maxSlippage) {
      updateLifecycleStatus({
        statusName: "slippageChange",
        statusData: {
          maxSlippage: newSlippage
        }
      });
    }
  }, [
    lifecycleStatus.statusData.maxSlippage,
    updateLifecycleStatus
  ]);
  const handleSlippageChange = useCallback16((e) => {
    const newSlippage = e.target.value;
    const parsedSlippage = Number.parseFloat(newSlippage);
    const isValidNumber = !Number.isNaN(parsedSlippage);
    updateSlippage(isValidNumber ? parsedSlippage : 0);
  }, [
    updateSlippage
  ]);
  const handleSlippageSettingChange = useCallback16((setting) => {
    setSlippageSetting(setting);
    if (setting === SLIPPAGE_SETTINGS.AUTO) {
      updateSlippage(defaultMaxSlippage);
    }
  }, [
    defaultMaxSlippage,
    updateSlippage
  ]);
  return /* @__PURE__ */ React.createElement("section", {
    className: cn(background.default, border.defaultActive, border.radius, "flex items-center gap-2", className)
  }, /* @__PURE__ */ React.createElement("fieldset", {
    className: cn(background.default, border.defaultActive, border.radius, "flex h-9 flex-1 rounded-xl border p-1")
  }, /* @__PURE__ */ React.createElement("legend", {
    className: "sr-only"
  }, "Slippage Setting"), Object.values(SLIPPAGE_SETTINGS).map((setting) => /* @__PURE__ */ React.createElement("button", {
    key: setting,
    type: "button",
    className: cn(
      pressable.default,
      color.foreground,
      text.label1,
      border.radiusInner,
      "flex-1 px-3 py-1 transition-colors",
      // Highlight the button if it is selected
      slippageSetting === setting ? cn(background.inverse, color.primary, pressable.shadow) : color.foregroundMuted
    ),
    onClick: /* @__PURE__ */ __name(() => handleSlippageSettingChange(setting), "onClick")
  }, setting))), /* @__PURE__ */ React.createElement("div", {
    className: cn(background.default, border.defaultActive, border.radius, "flex h-9 w-24 items-center justify-between border px-2 py-1", slippageSetting === SLIPPAGE_SETTINGS.AUTO && "opacity-50")
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "slippage-input",
    className: "sr-only"
  }, "Slippage Percentage"), /* @__PURE__ */ React.createElement("input", {
    id: "slippage-input",
    type: "text",
    value: lifecycleStatus.statusData.maxSlippage,
    onChange: handleSlippageChange,
    disabled: slippageSetting === SLIPPAGE_SETTINGS.AUTO,
    className: cn(color.foreground, text.label2, "w-full flex-grow bg-transparent pl-1 font-normal leading-6 focus:outline-none", slippageSetting === SLIPPAGE_SETTINGS.AUTO && "cursor-not-allowed")
  }), /* @__PURE__ */ React.createElement("span", {
    className: cn(background.default, color.foreground, text.label2, "ml-1 flex-shrink-0 font-normal leading-6")
  }, "%")));
}
__name(SwapSettingsSlippageInput, "SwapSettingsSlippageInput");

// src/swap/components/SwapSettingsSlippageTitle.tsx
function SwapSettingsSlippageTitle({ children, className }) {
  return /* @__PURE__ */ React.createElement("h3", {
    className: cn(text.headline, color.foreground, "mb-2 text-base", className)
  }, children);
}
__name(SwapSettingsSlippageTitle, "SwapSettingsSlippageTitle");

// src/swap/components/SwapSettingsSlippageLayout.tsx
function SwapSettingsSlippageLayout({ children, className }) {
  const { title, description, input } = useMemo19(() => {
    const childrenArray = Children8.toArray(children);
    return {
      title: childrenArray.find(findComponent(SwapSettingsSlippageTitle)),
      description: childrenArray.find(findComponent(SwapSettingsSlippageDescription)),
      input: childrenArray.find(findComponent(SwapSettingsSlippageInput))
    };
  }, [
    children
  ]);
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(background.default, border.radius, line.default, "right-0 z-10 w-[21.75rem] px-3 py-3", className),
    "data-testid": "ockSwapSettingsLayout_container"
  }, title, description, /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center justify-between gap-2"
  }, input && /* @__PURE__ */ React.createElement("div", {
    className: "flex-grow"
  }, input)));
}
__name(SwapSettingsSlippageLayout, "SwapSettingsSlippageLayout");

// src/swap/components/SwapSettingsSlippageLayoutBottomSheet.tsx
import { Children as Children9, useMemo as useMemo20 } from "react";
function SwapSettingsSlippageLayoutBottomSheet({ children, className }) {
  const { title, description, input } = useMemo20(() => {
    const childrenArray = Children9.toArray(children);
    return {
      title: childrenArray.find(findComponent(SwapSettingsSlippageTitle)),
      description: childrenArray.find(findComponent(SwapSettingsSlippageDescription)),
      input: childrenArray.find(findComponent(SwapSettingsSlippageInput))
    };
  }, [
    children
  ]);
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(background.default, border.default, pressable.shadow, "right-0 z-10 h-full w-full rounded-t-lg px-3 pt-2 pb-3", className),
    "data-testid": "ockSwapSettingsLayout_container"
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn(background.alternate, "mx-auto mb-2 h-1 w-4 rounded-[6.25rem]")
  }), /* @__PURE__ */ React.createElement("div", {
    className: "mb-4 flex items-center justify-center"
  }, /* @__PURE__ */ React.createElement("h2", {
    className: cn(color.foreground, "font-bold text-sm")
  }, "Settings")), /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-col"
  }, title, /* @__PURE__ */ React.createElement("div", {
    className: "pb-4"
  }, description), input && /* @__PURE__ */ React.createElement("div", {
    className: "flex-grow"
  }, input)), /* @__PURE__ */ React.createElement("div", {
    className: "mt-4 flex justify-center"
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn(background.inverse, "h-1 w-28 shrink-0 rounded-[0.43931rem]")
  })));
}
__name(SwapSettingsSlippageLayoutBottomSheet, "SwapSettingsSlippageLayoutBottomSheet");

// src/swap/components/SwapSettings.tsx
function SwapSettings({ children, className, icon: icon2 = "swapSettings", text: buttonText = "" }) {
  const breakpoint = useBreakpoints();
  const [isOpen, setIsOpen] = useState15(false);
  const dropdownRef = useRef5(null);
  const handleToggle = useCallback17(() => {
    setIsOpen(!isOpen);
  }, [
    isOpen
  ]);
  const handleClickOutsideComponent = useCallback17((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);
  useEffect11(() => {
    document.addEventListener("mousedown", handleClickOutsideComponent);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideComponent);
    };
  }, [
    handleClickOutsideComponent
  ]);
  const iconSvg = useIcon({
    icon: icon2
  });
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("flex w-full items-center justify-end space-x-1", className),
    "data-testid": "ockSwapSettings_Settings"
  }, buttonText && /* @__PURE__ */ React.createElement("span", {
    className: cn(text.body)
  }, buttonText), /* @__PURE__ */ React.createElement("div", {
    className: cn("relative", isOpen && "group"),
    ref: dropdownRef
  }, /* @__PURE__ */ React.createElement("button", {
    type: "button",
    "aria-label": "Toggle swap settings",
    className: cn(pressable.default, "rounded-full p-2 opacity-50 transition-opacity hover:opacity-100"),
    onClick: handleToggle
  }, /* @__PURE__ */ React.createElement("div", {
    className: "h-[1.125rem] w-[1.125rem]"
  }, iconSvg)), breakpoint === "sm" ? /* @__PURE__ */ React.createElement("div", {
    className: cn(background.inverse, pressable.shadow, "fixed inset-x-0 z-50 transition-[bottom] duration-300 ease-in-out", "-bottom-[12.875rem] h-[12.875rem] rounded-t-lg group-[]:bottom-0", className),
    "data-testid": "ockSwapSettingsSlippageLayoutBottomSheet_container"
  }, /* @__PURE__ */ React.createElement(SwapSettingsSlippageLayoutBottomSheet, {
    className
  }, children)) : isOpen && /* @__PURE__ */ React.createElement("div", {
    className: cn(border.radius, background.default, pressable.shadow, "absolute right-0 z-10 mt-1 w-[21.75rem] rounded-lg"),
    "data-testid": "ockSwapSettingsDropdown"
  }, /* @__PURE__ */ React.createElement(SwapSettingsSlippageLayout, null, children))));
}
__name(SwapSettings, "SwapSettings");

// src/swap/components/SwapToast.tsx
import { useCallback as useCallback18, useEffect as useEffect12, useMemo as useMemo21 } from "react";
import { useAccount as useAccount9 } from "wagmi";

// src/internal/svg/successSvg.tsx
var successSvg = /* @__PURE__ */ React.createElement("svg", {
  "aria-label": "ock-successSvg",
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "data-testid": "ock-successSvg"
}, /* @__PURE__ */ React.createElement("title", null, "Success SVG"), /* @__PURE__ */ React.createElement("path", {
  d: "M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM6.72667 11.5333L3.73333 8.54L4.67333 7.6L6.72667 9.65333L11.44 4.94L12.38 5.88L6.72667 11.5333Z",
  fill: "#65A30D"
}));

// src/internal/utils/getToastPosition.ts
function getToastPosition(position) {
  if (position === "bottom-right") {
    return "bottom-5 left-3/4";
  }
  if (position === "top-right") {
    return "top-[100px] left-3/4";
  }
  if (position === "top-center") {
    return "top-[100px] left-2/4";
  }
  return "bottom-5 left-2/4";
}
__name(getToastPosition, "getToastPosition");

// src/network/getChainExplorer.ts
import { baseSepolia as baseSepolia5 } from "viem/chains";
function getChainExplorer(chainId) {
  if (chainId === baseSepolia5.id) {
    return "https://sepolia.basescan.org";
  }
  return "https://basescan.org";
}
__name(getChainExplorer, "getChainExplorer");

// src/swap/components/SwapToast.tsx
function SwapToast({ className, durationMs = 3e3, position = "bottom-center" }) {
  const { isToastVisible, setIsToastVisible, setTransactionHash, transactionHash } = useSwapContext();
  const { chainId } = useAccount9();
  const chainExplorer = getChainExplorer(chainId);
  const closeToast = useCallback18(() => {
    setIsToastVisible?.(false);
  }, [
    setIsToastVisible
  ]);
  const positionClass = useMemo21(() => {
    return getToastPosition(position);
  }, [
    position
  ]);
  useEffect12(() => {
    const timer = setTimeout(() => {
      if (isToastVisible) {
        setIsToastVisible?.(false);
        setTransactionHash?.("");
      }
    }, durationMs);
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [
    durationMs,
    isToastVisible,
    setIsToastVisible,
    setTransactionHash
  ]);
  if (!isToastVisible) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(background.default, "flex animate-enter items-center justify-between rounded-lg", "p-2 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)]", "-translate-x-2/4 fixed z-20", positionClass, className),
    "data-testid": "ockSwapToast"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center gap-4 p-2"
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn(text.label2)
  }, successSvg), /* @__PURE__ */ React.createElement("div", {
    className: cn(text.label1, "text-nowrap")
  }, /* @__PURE__ */ React.createElement("p", {
    className: color.foreground
  }, "Successful")), /* @__PURE__ */ React.createElement("div", {
    className: cn(text.label1, "text-nowrap")
  }, /* @__PURE__ */ React.createElement("a", {
    href: `${chainExplorer}/tx/${transactionHash}`,
    target: "_blank",
    rel: "noreferrer"
  }, /* @__PURE__ */ React.createElement("span", {
    className: cn(text.label1, color.primary)
  }, "View transaction")))), /* @__PURE__ */ React.createElement("button", {
    className: "p-2",
    onClick: closeToast,
    type: "button",
    "data-testid": "ockCloseButton"
  }, closeSvg));
}
__name(SwapToast, "SwapToast");

// src/internal/svg/toggleSvg.tsx
var toggleSvg = /* @__PURE__ */ React.createElement("svg", {
  role: "img",
  "aria-label": "ock-toggleSvg",
  width: "16",
  height: "17",
  viewBox: "0 0 16 17",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "data-testid": "ock-toggleSvg"
}, /* @__PURE__ */ React.createElement("g", {
  clipPath: "url(#clip0_2077_4627)"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M14.5659 4.93434L13.4345 6.06571L11.8002 4.43139L11.8002 10.75L10.2002 10.75L10.2002 4.43139L8.56592 6.06571L7.43455 4.93434L11.0002 1.36865L14.5659 4.93434ZM8.56592 12.0657L5.00023 15.6314L1.43455 12.0657L2.56592 10.9343L4.20023 12.5687L4.20023 6.25002L5.80023 6.25002L5.80023 12.5687L7.43455 10.9343L8.56592 12.0657Z",
  className: icon.foreground
})), /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("clipPath", {
  id: "clip0_2077_4627"
}, /* @__PURE__ */ React.createElement("rect", {
  width: "16",
  height: "16",
  fill: "white",
  transform: "translate(0 0.5)"
}))));

// src/swap/components/SwapToggleButton.tsx
function SwapToggleButton({ className }) {
  const { handleToggle } = useSwapContext();
  return /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: cn(pressable.alternate, border.default, "-translate-x-2/4 -translate-y-2/4 absolute top-2/4 left-2/4", "flex h-12 w-12 items-center justify-center", "rounded-lg border-4 border-solid", className),
    "data-testid": "SwapTokensButton",
    onClick: handleToggle
  }, toggleSvg);
}
__name(SwapToggleButton, "SwapToggleButton");

// src/swap/components/Swap.tsx
function Swap({ children, config = {
  maxSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE
}, className, experimental = {
  useAggregator: false
}, isSponsored = false, onError, onStatus, onSuccess, title = "Swap" }) {
  const componentTheme = useTheme();
  const { inputs, toggleButton, swapButton, swapMessage, swapSettings, swapToast } = useMemo22(() => {
    const childrenArray = Children10.toArray(children);
    return {
      inputs: childrenArray.filter(findComponent(SwapAmountInput)),
      toggleButton: childrenArray.find(findComponent(SwapToggleButton)),
      swapButton: childrenArray.find(findComponent(SwapButton)),
      swapMessage: childrenArray.find(findComponent(SwapMessage2)),
      swapSettings: childrenArray.find(findComponent(SwapSettings)),
      swapToast: childrenArray.find(findComponent(SwapToast))
    };
  }, [
    children
  ]);
  const isMounted = useIsMounted();
  if (!isMounted) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(SwapProvider, {
    config,
    experimental,
    isSponsored,
    onError,
    onStatus,
    onSuccess
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn(componentTheme, background.default, border.radius, color.foreground, "flex w-[500px] flex-col px-6 pt-6 pb-4", className),
    "data-testid": "ockSwap_Container"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "mb-4 flex items-center justify-between"
  }, /* @__PURE__ */ React.createElement("h3", {
    className: cn(text.title3),
    "data-testid": "ockSwap_Title"
  }, title), swapSettings), inputs[0], /* @__PURE__ */ React.createElement("div", {
    className: "relative h-1"
  }, toggleButton), inputs[1], swapButton, swapToast, /* @__PURE__ */ React.createElement("div", {
    className: "flex"
  }, swapMessage)));
}
__name(Swap, "Swap");

// src/swap/components/SwapDefault.tsx
function SwapDefault({ config, className, disabled, experimental, from, isSponsored = false, onError, onStatus, onSuccess, title = "Swap", to }) {
  return /* @__PURE__ */ React.createElement(Swap, {
    className,
    onStatus,
    onSuccess,
    onError,
    config,
    isSponsored,
    title,
    experimental
  }, /* @__PURE__ */ React.createElement(SwapSettings, null, /* @__PURE__ */ React.createElement(SwapSettingsSlippageTitle, null, "Max. slippage"), /* @__PURE__ */ React.createElement(SwapSettingsSlippageDescription, null, "Your swap will revert if the prices change by more than the selected percentage."), /* @__PURE__ */ React.createElement(SwapSettingsSlippageInput, null)), /* @__PURE__ */ React.createElement(SwapAmountInput, {
    label: "Sell",
    swappableTokens: from,
    token: from?.[0],
    type: "from"
  }), /* @__PURE__ */ React.createElement(SwapToggleButton, null), /* @__PURE__ */ React.createElement(SwapAmountInput, {
    label: "Buy",
    swappableTokens: to,
    token: to?.[0],
    type: "to"
  }), /* @__PURE__ */ React.createElement(SwapButton, {
    disabled
  }), /* @__PURE__ */ React.createElement(SwapMessage2, null), /* @__PURE__ */ React.createElement(SwapToast, null));
}
__name(SwapDefault, "SwapDefault");
export {
  Swap,
  SwapAmountInput,
  SwapButton,
  SwapDefault,
  SwapMessage2 as SwapMessage,
  SwapSettings,
  SwapSettingsSlippageDescription,
  SwapSettingsSlippageInput,
  SwapSettingsSlippageTitle,
  SwapToast,
  SwapToggleButton
};
//# sourceMappingURL=index.js.map