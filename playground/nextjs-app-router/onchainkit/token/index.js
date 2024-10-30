var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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
var placeholder = {
  default: "ock-placeholder-default"
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

// src/internal/hooks/usePreferredColorScheme.ts
import { useEffect, useState } from "react";
function usePreferredColorScheme() {
  const [colorScheme, setColorScheme] = useState("light");
  useEffect(() => {
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

// src/token/components/TokenImage.tsx
import { useMemo as useMemo2 } from "react";

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
  const styles = useMemo2(() => {
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
import { useCallback as useCallback2, useState as useState2 } from "react";

// src/internal/components/TextInput.tsx
import { useCallback } from "react";

// src/internal/hooks/useDebounce.ts
import { useLayoutEffect, useMemo as useMemo3, useRef } from "react";
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
  return useMemo3(() => {
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

// src/token/components/TokenSearch.tsx
function TokenSearch({ className, onChange, delayMs = 200 }) {
  const componentTheme = useTheme();
  const [value, setValue] = useState2("");
  const handleClear = useCallback2(() => {
    setValue("");
    onChange("");
  }, [
    onChange
  ]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "relative flex items-center"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "-translate-y-1/2 absolute top-1/2 left-4"
  }, searchIconSvg), /* @__PURE__ */ React.createElement(TextInput, {
    className: cn(componentTheme, pressable.alternate, color.foreground, placeholder.default, "w-full rounded-xl py-2 pr-5 pl-12 outline-none", className),
    placeholder: "Search for a token",
    value,
    setValue,
    onChange,
    delayMs
  }), value && /* @__PURE__ */ React.createElement("button", {
    type: "button",
    "data-testid": "ockTextInput_Clear",
    className: "-translate-y-1/2 absolute top-1/2 right-4",
    onClick: handleClear
  }, closeSvg));
}
__name(TokenSearch, "TokenSearch");

// src/token/components/TokenSelectDropdown.tsx
import { useCallback as useCallback3, useEffect as useEffect2, useRef as useRef2, useState as useState3 } from "react";

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
  const [isOpen, setIsOpen] = useState3(false);
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
  useEffect2(() => {
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
import { useCallback as useCallback4, useEffect as useEffect3, useRef as useRef3, useState as useState4 } from "react";
var backdropStyle = {
  background: "rgba(226, 232, 240, 0.5)"
};
function TokenSelectModalInner({ setToken, closeModal, options }) {
  const [filteredTokens, setFilteredTokens] = useState4(options);
  const modalRef = useRef3(null);
  const handleClick = useCallback4((token) => {
    setToken(token);
    closeModal();
  }, [
    setToken,
    closeModal
  ]);
  const handleChange = useCallback4((text2) => {
    setFilteredTokens(options.filter(({ address, name, symbol }) => {
      return address.toLowerCase().startsWith(text2) || name.toLowerCase().includes(text2) || symbol.toLowerCase().includes(text2);
    }));
  }, [
    options
  ]);
  const handleBlur = useCallback4((event) => {
    const isOutsideModal = modalRef.current && !modalRef.current.contains(event.target);
    if (isOutsideModal) {
      closeModal();
    }
  }, [
    closeModal
  ]);
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
    "data-testid": "ockTokenSelectModal_Inner",
    className: "fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center",
    style: backdropStyle
  }, /* @__PURE__ */ React.createElement("div", {
    ref: modalRef,
    className: cn(background.default, "flex w-[475px] flex-col gap-3 rounded-3xl p-6")
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center justify-between"
  }, /* @__PURE__ */ React.createElement("span", {
    className: text.title3
  }, "Select a token"), /* @__PURE__ */ React.createElement("button", {
    "data-testid": "TokenSelectModal_CloseButton",
    type: "button",
    onClick: closeModal
  }, /* @__PURE__ */ React.createElement("svg", {
    role: "img",
    "aria-label": "ock-close-icon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ React.createElement("path", {
    d: "M2.3352 1L1 2.33521L6.66479 8L1 13.6648L2.3352 15L8 9.33521L13.6648 15L15 13.6648L9.33521 8L15 2.33521L13.6648 1L8 6.6648L2.3352 1Z",
    fill: "#0A0B0D"
  })))), /* @__PURE__ */ React.createElement(TokenSearch, {
    onChange: handleChange,
    delayMs: 0
  }), filteredTokens.length > 0 && /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, filteredTokens.slice(0, 4).map((token, idx) => /* @__PURE__ */ React.createElement(TokenChip, {
    key: `${token.name}${idx}`,
    className: "shadow-none",
    token,
    onClick: handleClick
  }))), filteredTokens.length > 0 ? /* @__PURE__ */ React.createElement("div", {
    className: "mt-3"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "text-black text-body"
  }, "Tokens"), /* @__PURE__ */ React.createElement("div", {
    className: "ock-scrollbar overflow-y-auto",
    style: {
      minHeight: "300px",
      height: "300px"
    }
  }, filteredTokens.map((token, idx) => /* @__PURE__ */ React.createElement(TokenRow, {
    key: `${token.name}${idx}`,
    token,
    onClick: handleClick
  })))) : /* @__PURE__ */ React.createElement("div", {
    "data-testid": "ockTokenSelectModal_NoTokens",
    className: "text-black text-body",
    style: {
      minHeight: "368px"
    }
  }, "No tokens found")));
}
__name(TokenSelectModalInner, "TokenSelectModalInner");
function TokenSelectModal({ options, setToken, token }) {
  const [isOpen, setIsOpen] = useState4(false);
  const closeModal = useCallback4(() => {
    setIsOpen(false);
  }, []);
  const openModal = useCallback4(() => {
    setIsOpen(true);
  }, []);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(TokenSelectButton, {
    onClick: openModal,
    isOpen,
    token
  }), isOpen && /* @__PURE__ */ React.createElement(TokenSelectModalInner, {
    options,
    setToken,
    closeModal
  }));
}
__name(TokenSelectModal, "TokenSelectModal");
export {
  TokenChip,
  TokenImage,
  TokenRow,
  TokenSearch,
  TokenSelectDropdown,
  TokenSelectModal,
  formatAmount
};
//# sourceMappingURL=index.js.map