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
var fill = {
  default: "ock-fill-default",
  defaultReverse: "ock-fill-default-reverse",
  inverse: "ock-fill-inverse",
  alternate: "ock-fill-alternate"
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

// src/nft/components/NFTProvider.tsx
import { createContext, useCallback, useContext, useState } from "react";

// src/internal/hooks/useValue.ts
import { useMemo } from "react";
function useValue(object) {
  return useMemo(() => object, [
    object
  ]);
}
__name(useValue, "useValue");

// src/nft/components/NFTProvider.tsx
var emptyContext = {};
var NFTContext = /* @__PURE__ */ createContext(emptyContext);
function useNFTContext() {
  const context = useContext(NFTContext);
  if (context === emptyContext) {
    throw new Error("useNFTContext must be used within an NFTView or NFTMint component");
  }
  return context;
}
__name(useNFTContext, "useNFTContext");

// src/nft/components/view/NFTLastSoldPrice.tsx
function NFTLastSoldPrice({ className, label = "Mint price" }) {
  const { lastSoldPrice: { amount, currency, amountUSD } } = useNFTContext();
  if (!amount || !currency || !amountUSD) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("flex justify-between py-0.5", text.label2, className)
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn(color.foregroundMuted)
  }, label), /* @__PURE__ */ React.createElement("div", {
    className: "flex"
  }, /* @__PURE__ */ React.createElement("div", {
    className: text.label1
  }, amount, " ", currency), /* @__PURE__ */ React.createElement("div", {
    className: "px-2"
  }, "~"), /* @__PURE__ */ React.createElement("div", null, "$", formatAmount(`${amountUSD}`, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }))));
}
__name(NFTLastSoldPrice, "NFTLastSoldPrice");

// src/nft/components/view/NFTMedia.tsx
import { useCallback as useCallback5, useMemo as useMemo2 } from "react";

// src/nft/types.ts
var MediaType = /* @__PURE__ */ function(MediaType2) {
  MediaType2["Image"] = "image";
  MediaType2["Video"] = "video";
  MediaType2["Audio"] = "audio";
  MediaType2["Unknown"] = "unknown";
  return MediaType2;
}({});
var LifecycleType = /* @__PURE__ */ function(LifecycleType2) {
  LifecycleType2["VIEW"] = "view";
  LifecycleType2["MINT"] = "mint";
  return LifecycleType2;
}({});

// src/nft/components/NFTLifecycleProvider.tsx
import { createContext as createContext2, useContext as useContext2, useEffect } from "react";

// src/nft/hooks/useLifecycleStatus.ts
import { useCallback as useCallback2, useState as useState2 } from "react";

// src/nft/components/NFTLifecycleProvider.tsx
var emptyContext2 = {};
var NFTLifecycleContext = /* @__PURE__ */ createContext2(emptyContext2);
function useNFTLifecycleContext() {
  const context = useContext2(NFTLifecycleContext);
  if (context === emptyContext2) {
    throw new Error("useNFTLifecycleContext must be used within an NFTView or NFTMint component");
  }
  return context;
}
__name(useNFTLifecycleContext, "useNFTLifecycleContext");

// src/nft/components/view/NFTAudio.tsx
import { useCallback as useCallback3, useEffect as useEffect2, useRef, useState as useState3 } from "react";
function NFTAudio({ className, onLoading, onLoaded, onError }) {
  const { animationUrl } = useNFTContext();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState3(false);
  useEffect2(() => {
    function onEnded() {
      setIsPlaying(false);
    }
    __name(onEnded, "onEnded");
    if (animationUrl && audioRef?.current) {
      audioRef.current.onloadstart = () => {
        onLoading?.(animationUrl);
      };
      audioRef.current.onloadeddata = () => {
        onLoaded?.();
      };
      audioRef.current.addEventListener("ended", onEnded);
      audioRef.current.onerror = (error) => {
        onError?.({
          error: typeof error === "string" ? error : error.type,
          code: "NmNAc01",
          message: "Error loading audio"
        });
      };
    }
  }, [
    animationUrl,
    onLoading,
    onLoaded,
    onError
  ]);
  const handlePlayPause = useCallback3((event) => {
    event.stopPropagation();
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  }, [
    isPlaying
  ]);
  if (!animationUrl) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("max-h-350 w-350 max-w-350", className)
  }, /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: cn(background.reverse, "ml-6 inline-flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full"),
    onClick: handlePlayPause
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn("ml-px box-border h-[18px] transition-all ease-[100ms] will-change-[border-width]", "border-transparent border-l-[var(--ock-bg-default)] hover:border-l-[var(--ock-bg-default-hover)]", {
      "border-[length:0_0_0_16px] border-double": isPlaying,
      "-mr-px border-[length:9px_0_9px_16px] border-solid": !isPlaying
    })
  })), /* @__PURE__ */ React.createElement("audio", {
    ref: audioRef,
    "data-testid": "ockNFTAudio",
    autoPlay: false,
    controls: false,
    src: animationUrl
  }, /* @__PURE__ */ React.createElement("track", {
    kind: "captions"
  })));
}
__name(NFTAudio, "NFTAudio");

// src/nft/components/view/NFTImage.tsx
import { useCallback as useCallback4, useEffect as useEffect3, useState as useState4 } from "react";

// src/internal/svg/defaultNFTSvg.tsx
var defaultNFTSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-defaultNFTSvg",
  role: "img",
  "aria-label": "loading",
  width: "100%",
  height: "100%",
  viewBox: "0 0 527.008 525",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("rect", {
  fill: "#F3F4F6",
  width: "100%",
  height: "100%",
  className: fill.alternate
}), /* @__PURE__ */ React.createElement("path", {
  d: "M232.062 258.667C232.062 268.125 236.209 276.614 242.783 282.417H284.675C291.249 276.614 295.396 268.125 295.396 258.667C295.396 241.178 281.218 227 263.729 227C246.24 227 232.062 241.178 232.062 258.667ZM265.697 253.74L276.646 257.792L265.697 261.843L261.646 272.792L257.594 261.843L246.646 257.792L257.594 253.74L261.646 242.792L265.697 253.74ZM274.146 237.792L276.172 243.266L281.646 245.292L276.172 247.317L274.146 252.792L272.12 247.317L266.646 245.292L272.12 243.266L274.146 237.792Z",
  fill: "#6B7280",
  className: fill.defaultReverse
}), /* @__PURE__ */ React.createElement("path", {
  d: "M287.479 288.25H240.813L234.979 297H293.312L287.479 288.25Z",
  fill: "#6B7280",
  className: fill.defaultReverse
}));

// src/nft/components/view/NFTImage.tsx
function NFTImage({ className, onLoading, onLoaded, onError }) {
  const { imageUrl, description } = useNFTContext();
  const [loaded, setLoaded] = useState4(false);
  const [error, setError] = useState4(false);
  const [transitionEnded, setTransitionEnded] = useState4(false);
  const loadImage = useCallback4(() => {
    if (imageUrl) {
      onLoading?.(imageUrl);
      const img = new Image();
      img.onload = () => {
        setLoaded(true);
        onLoaded?.();
      };
      img.onerror = (error2) => {
        onError?.({
          error: typeof error2 === "string" ? error2 : error2.type,
          code: "NmNIc01",
          message: "Error loading image"
        });
        setError(true);
      };
      img.src = imageUrl;
    }
  }, [
    imageUrl,
    onLoading,
    onLoaded,
    onError
  ]);
  useEffect3(() => {
    loadImage();
  }, [
    loadImage
  ]);
  const handleRetry = useCallback4(async () => {
    setError(false);
    loadImage();
  }, [
    loadImage
  ]);
  const handleTransitionEnd = useCallback4(() => {
    setTransitionEnded(true);
  }, []);
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("relative flex h-[450px] max-h-screen items-center justify-center", className)
  }, error && /* @__PURE__ */ React.createElement("div", {
    className: "absolute top-[60%] z-10"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "button",
    onClick: handleRetry
  }, "retry")), !transitionEnded && /* @__PURE__ */ React.createElement("div", {
    className: `absolute inset-0 ${loaded ? "opacity-0" : "opacity-100"} transition-[opacity] duration-500 ease-in-out`
  }, defaultNFTSvg), /* @__PURE__ */ React.createElement("img", {
    "data-testid": "ockNFTImage",
    src: imageUrl,
    alt: description,
    decoding: "async",
    className: `max-h-[450px] transition-[opacity] duration-500 ease-in-out ${loaded ? "opacity-100" : "opacity-0"}`,
    onTransitionEnd: handleTransitionEnd
  }));
}
__name(NFTImage, "NFTImage");

// src/nft/components/view/NFTVideo.tsx
import { useEffect as useEffect4, useRef as useRef2 } from "react";
function NFTVideo({ className, onLoading, onLoaded, onError }) {
  const { animationUrl, imageUrl } = useNFTContext();
  const videoRef = useRef2(null);
  useEffect4(() => {
    if (animationUrl && videoRef?.current) {
      videoRef.current.onloadstart = () => {
        onLoading?.(animationUrl);
      };
      videoRef.current.onloadeddata = () => {
        onLoaded?.();
      };
      videoRef.current.onerror = (error) => {
        onError?.({
          error: typeof error === "string" ? error : error.type,
          code: "NmNVc01",
          message: "Error loading video"
        });
      };
    }
  }, [
    animationUrl,
    onLoading,
    onLoaded,
    onError
  ]);
  if (!animationUrl) {
    return /* @__PURE__ */ React.createElement("div", {
      className: "max-h-350 w-350 max-w-350"
    }, defaultNFTSvg);
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("max-h-350 w-350 max-w-350", className)
  }, /* @__PURE__ */ React.createElement("video", {
    ref: videoRef,
    "data-testid": "ockNFTVideo",
    poster: imageUrl,
    controls: true,
    loop: true,
    src: animationUrl,
    muted: true,
    autoPlay: true,
    playsInline: true,
    draggable: false,
    width: "100%"
  }));
}
__name(NFTVideo, "NFTVideo");

// src/nft/components/view/NFTMedia.tsx
function NFTMedia() {
  const { mimeType } = useNFTContext();
  const { type, updateLifecycleStatus } = useNFTLifecycleContext();
  const mediaType = useMemo2(() => {
    if (mimeType?.startsWith("video")) {
      return MediaType.Video;
    }
    if (mimeType?.startsWith("audio") || mimeType?.startsWith("application")) {
      return MediaType.Audio;
    }
    if (mimeType?.startsWith("image")) {
      return MediaType.Image;
    }
    return MediaType.Unknown;
  }, [
    mimeType
  ]);
  const handleLoading = useCallback5((mediaUrl) => {
    updateLifecycleStatus({
      statusName: "mediaLoading",
      statusData: {
        mediaType,
        mediaUrl
      }
    });
  }, [
    mediaType,
    updateLifecycleStatus
  ]);
  const handleLoaded = useCallback5(() => {
    updateLifecycleStatus({
      statusName: type === LifecycleType.MINT ? "mediaLoaded" : "success"
    });
  }, [
    type,
    updateLifecycleStatus
  ]);
  const handleError = useCallback5((error) => {
    updateLifecycleStatus({
      statusName: "error",
      statusData: error
    });
  }, [
    updateLifecycleStatus
  ]);
  switch (mediaType) {
    case MediaType.Video:
      return /* @__PURE__ */ React.createElement(NFTVideo, {
        onLoading: handleLoading,
        onLoaded: handleLoaded,
        onError: handleError
      });
    case MediaType.Audio:
      return /* @__PURE__ */ React.createElement("div", {
        className: "relative w-full"
      }, /* @__PURE__ */ React.createElement(NFTImage, null), /* @__PURE__ */ React.createElement("div", {
        className: "absolute bottom-4 mx-auto w-full"
      }, /* @__PURE__ */ React.createElement(NFTAudio, null)));
    default:
      return /* @__PURE__ */ React.createElement(NFTImage, {
        onLoading: handleLoading,
        onLoaded: handleLoaded,
        onError: handleError
      });
  }
}
__name(NFTMedia, "NFTMedia");

// src/nft/components/view/NFTMintDate.tsx
import { useMemo as useMemo3 } from "react";
var DATE_OPTIONS = {
  year: "numeric",
  month: "short",
  day: "numeric"
};
function NFTMintDate({ className, label = "Mint date" }) {
  const { mintDate } = useNFTContext();
  const formattedDate = useMemo3(() => {
    if (!mintDate) {
      return null;
    }
    const formatter = new Intl.DateTimeFormat(void 0, DATE_OPTIONS);
    return formatter.format(mintDate);
  }, [
    mintDate
  ]);
  if (!formattedDate) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("flex items-center justify-between py-0.5", text.label2, className)
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn(color.foregroundMuted)
  }, label), /* @__PURE__ */ React.createElement("div", null, formattedDate));
}
__name(NFTMintDate, "NFTMintDate");

// src/identity/components/Address.tsx
import { useState as useState5 } from "react";

// src/identity/utils/getSlicedAddress.ts
var getSlicedAddress = /* @__PURE__ */ __name((address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}, "getSlicedAddress");

// src/identity/components/IdentityProvider.tsx
import { createContext as createContext4, useContext as useContext4 } from "react";

// src/useOnchainKit.tsx
import { useContext as useContext3 } from "react";

// src/OnchainKitProvider.tsx
import { createContext as createContext3, useMemo as useMemo4 } from "react";

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
var OnchainKitContext = /* @__PURE__ */ createContext3(ONCHAIN_KIT_CONFIG);

// src/useOnchainKit.tsx
function useOnchainKit() {
  return useContext3(OnchainKitContext);
}
__name(useOnchainKit, "useOnchainKit");

// src/identity/components/IdentityProvider.tsx
var emptyContext3 = {};
var IdentityContext = /* @__PURE__ */ createContext4(emptyContext3);
function useIdentityContext() {
  return useContext4(IdentityContext);
}
__name(useIdentityContext, "useIdentityContext");
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

// src/identity/components/Address.tsx
function Address({ address = null, className, isSliced = true }) {
  const [copyText, setCopyText] = useState5("Copy");
  const { address: contextAddress } = useIdentityContext();
  if (!contextAddress && !address) {
    console.error("Address: an Ethereum address must be provided to the Identity or Address component.");
    return null;
  }
  const accountAddress = address ?? contextAddress;
  const handleClick = /* @__PURE__ */ __name(() => {
    navigator.clipboard.writeText(accountAddress).then(() => {
      setCopyText("Copied");
      setTimeout(() => setCopyText("Copy"), 2e3);
    }).catch((err) => {
      console.error("Failed to copy address: ", err);
    });
  }, "handleClick");
  const handleKeyDown = /* @__PURE__ */ __name((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }, "handleKeyDown");
  return /* @__PURE__ */ React.createElement("span", {
    "data-testid": "ockAddress",
    className: cn(color.foregroundMuted, text.label2, className, "group relative cursor-pointer"),
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    tabIndex: 0,
    role: "button"
  }, isSliced ? getSlicedAddress(accountAddress) : accountAddress, /* @__PURE__ */ React.createElement("span", {
    className: cn(pressable.alternate, text.legal, color.foreground, border.default, border.radius, "absolute top-full left-[0%] z-10 mt-0.5 px-1.5 py-0.5 opacity-0 transition-opacity group-hover:opacity-100")
  }, copyText));
}
__name(Address, "Address");

// src/identity/components/Avatar.tsx
import { Children, useMemo as useMemo5 } from "react";

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

// src/internal/svg/defaultLoadingSVG.tsx
var defaultLoadingSVG = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-defaultLoadingSVG",
  role: "img",
  "aria-label": "ock-defaultLoadingSVG",
  width: "100%",
  height: "100%",
  viewBox: "0 0 100 100",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("circle", {
  cx: "50",
  cy: "50",
  r: "45",
  stroke: "#333",
  fill: "none",
  strokeWidth: "10",
  strokeLinecap: "round"
}, /* @__PURE__ */ React.createElement("animateTransform", {
  attributeName: "transform",
  type: "rotate",
  from: "0 50 50",
  to: "360 50 50",
  dur: "1s",
  repeatCount: "indefinite"
})));

// src/internal/utils/findComponent.ts
import { isValidElement } from "react";
function findComponent(component) {
  return (child) => {
    return isValidElement(child) && child.type === component;
  };
}
__name(findComponent, "findComponent");

// src/identity/hooks/useAvatar.ts
import { useQuery } from "@tanstack/react-query";
import { mainnet as mainnet3 } from "viem/chains";

// src/identity/utils/getAvatar.ts
import { mainnet as mainnet2 } from "viem/chains";
import { normalize } from "viem/ens";

// src/isBase.ts
import { base, baseSepolia as baseSepolia2 } from "viem/chains";
function isBase({ chainId, isMainnetOnly = false }) {
  if (isMainnetOnly && chainId === base.id) {
    return true;
  }
  if (!isMainnetOnly && (chainId === baseSepolia2.id || chainId === base.id)) {
    return true;
  }
  return false;
}
__name(isBase, "isBase");

// src/isEthereum.ts
import { mainnet, sepolia } from "viem/chains";
function isEthereum({ chainId, isMainnetOnly = false }) {
  if (isMainnetOnly && chainId === mainnet.id) {
    return true;
  }
  if (!isMainnetOnly && (chainId === sepolia.id || chainId === mainnet.id)) {
    return true;
  }
  return false;
}
__name(isEthereum, "isEthereum");

// src/network/getChainPublicClient.ts
import { http, createPublicClient } from "viem";
function getChainPublicClient(chain) {
  return createPublicClient({
    chain,
    transport: http()
  });
}
__name(getChainPublicClient, "getChainPublicClient");

// src/identity/constants.ts
import { base as base2, baseSepolia as baseSepolia3 } from "viem/chains";
var RESOLVER_ADDRESSES_BY_CHAIN_ID = {
  [baseSepolia3.id]: "0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA",
  [base2.id]: "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD"
};
var BASE_DEFAULT_PROFILE_PICTURES1 = `<svg width="3000" height="3000" viewBox="0 0 3000 3000" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5569_72801)"><rect width="3000" height="3000" fill="#155DFD"/><circle cx="1500" cy="1500" r="1500" fill="#155DFD"/><path d="M2596.93 1721.27C2605.58 1648.75 2610.21 1574.9 2610.21 1500C2610.21 1425.1 2605.58 1351.4 2596.93 1278.73C2770.3 1177.28 2815.96 914.534 2631.1 772.941C2553.96 713.858 2472.05 660.593 2385.96 614.042C2339.26 528.102 2286.14 446.041 2227.06 368.904C2085.47 184.192 1822.72 229.699 1721.27 403.071C1648.75 394.417 1574.9 389.792 1500 389.792C1425.1 389.792 1351.4 394.417 1278.73 403.071C1177.28 229.699 914.534 184.043 772.941 368.904C713.858 446.041 660.593 527.953 614.042 614.042C528.102 660.742 446.041 713.858 368.904 772.941C184.192 914.534 229.699 1177.28 403.071 1278.73C394.417 1351.25 389.792 1425.1 389.792 1500C389.792 1574.9 394.417 1648.6 403.071 1721.27C229.699 1822.72 184.043 2085.47 368.904 2227.06C446.041 2286.14 527.953 2339.41 614.042 2385.96C660.742 2471.9 713.858 2553.96 772.941 2631.1C914.534 2815.81 1177.28 2770.3 1278.73 2596.93C1351.25 2605.58 1425.1 2610.21 1500 2610.21C1574.9 2610.21 1648.6 2605.58 1721.27 2596.93C1822.72 2770.3 2085.47 2815.96 2227.06 2631.1C2286.14 2553.96 2339.41 2472.05 2385.96 2385.96C2471.9 2339.26 2553.96 2286.14 2631.1 2227.06C2815.81 2085.47 2770.3 1822.72 2596.93 1721.27Z" fill="white"/><path d="M1391.06 1500C1391.06 1647.89 1358.4 1781.62 1305.74 1878.28C1253.03 1975.05 1180.69 2034 1101.53 2034C1022.36 2034 950.031 1975.05 897.314 1878.28C844.66 1781.62 812 1647.89 812 1500C812 1352.11 844.66 1218.38 897.314 1121.72C950.031 1024.95 1022.36 966 1101.53 966C1180.69 966 1253.03 1024.95 1305.74 1121.72C1358.4 1218.38 1391.06 1352.11 1391.06 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="1102.57" cy="1194.93" rx="126.414" ry="231.934" fill="white"/><path d="M2187.16 1500C2187.16 1647.89 2154.5 1781.62 2101.84 1878.28C2049.13 1975.05 1976.79 2034 1897.63 2034C1818.46 2034 1746.13 1975.05 1693.41 1878.28C1640.76 1781.62 1608.1 1647.89 1608.1 1500C1608.1 1352.11 1640.76 1218.38 1693.41 1121.72C1746.13 1024.95 1818.46 966 1897.63 966C1976.79 966 2049.13 1024.95 2101.84 1121.72C2154.5 1218.38 2187.16 1352.11 2187.16 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="1896.58" cy="1194.93" rx="126.414" ry="231.934" fill="white"/></g><defs><clipPath id="clip0_5569_72801"><rect width="3000" height="3000" fill="white"/></clipPath></defs></svg>`;
var BASE_DEFAULT_PROFILE_PICTURES2 = `<svg width="3000" height="3000" viewBox="0 0 3000 3000" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5569_72809)"><rect width="3000" height="3000" fill="#155DFD"/><circle cx="1500" cy="1500" r="1500" fill="#155DFD"/><path d="M2188.12 1131.95C2691.11 591.187 2356.8 256.94 1815.91 759.826C1767.57 804.826 1737.56 866.494 1733.32 932.403C1733.32 933.767 1733.17 934.979 1733.02 936.343C1722.56 1094.68 1853.35 1225.44 2011.72 1214.98C2013.08 1214.98 2014.29 1214.83 2015.66 1214.68C2081.58 1210.44 2143.26 1180.44 2188.27 1132.1L2188.12 1131.95Z" fill="white"/><path d="M759.879 1816.05C256.885 2356.81 591.204 2691.06 1132.08 2188.17C1180.43 2143.17 1210.44 2081.51 1214.68 2015.6C1214.68 2014.23 1214.83 2013.02 1214.98 2011.66C1225.44 1853.32 1094.65 1722.56 936.283 1733.02C934.919 1733.02 933.706 1733.17 932.342 1733.32C866.418 1737.56 804.738 1767.56 759.727 1815.9L759.879 1816.05Z" fill="white"/><path d="M1131.96 759.922C591.247 256.826 256.881 591.264 759.869 1132.09C804.865 1180.43 866.527 1210.44 932.431 1214.68C933.794 1214.68 935.006 1214.83 936.37 1214.98C1094.69 1225.44 1225.44 1094.66 1214.98 936.309C1214.98 934.946 1214.83 933.733 1214.68 932.369C1210.44 866.452 1180.44 804.777 1132.11 759.771L1131.96 759.922Z" fill="white"/><path d="M1816.05 2188.12C2356.81 2691.11 2691.06 2356.8 2188.17 1815.91C2143.17 1767.57 2081.51 1737.56 2015.6 1733.32C2014.23 1733.32 2013.02 1733.17 2011.66 1733.02C1853.32 1722.56 1722.56 1853.35 1733.02 2011.72C1733.02 2013.08 1733.17 2014.29 1733.32 2015.66C1737.56 2081.58 1767.56 2143.26 1815.9 2188.27L1816.05 2188.12Z" fill="white"/><path d="M1737.18 727.02C1710.36 -10.3398 1237.66 -10.3398 1210.84 727.02C1208.42 792.869 1230.84 857.658 1274.48 907.31C1275.39 908.37 1276.14 909.278 1277.05 910.338C1381.59 1029.62 1566.43 1029.62 1670.97 910.338C1671.88 909.278 1672.63 908.37 1673.54 907.31C1717.18 857.81 1739.45 793.02 1737.18 727.02Z" fill="white"/><path d="M727.02 1210.82C-10.3398 1237.64 -10.3398 1710.34 727.02 1737.16C792.869 1739.58 857.658 1717.16 907.31 1673.52C908.218 1672.62 909.278 1671.86 910.338 1670.95C1029.62 1566.41 1029.62 1381.57 910.338 1277.03C909.278 1276.12 908.37 1275.37 907.31 1274.46C857.81 1230.82 793.02 1208.55 727.02 1210.82Z" fill="white"/><path d="M2040.69 1274.48C2039.63 1275.39 2038.72 1276.14 2037.66 1277.05C1918.38 1381.59 1918.38 1566.43 2037.66 1670.97C2038.72 1671.88 2039.63 1672.63 2040.69 1673.54C2090.19 1717.18 2154.98 1739.45 2220.98 1737.18C2958.34 1710.36 2958.34 1237.66 2220.98 1210.84C2155.13 1208.42 2090.34 1230.84 2040.69 1274.48Z" fill="white"/><path d="M1210.82 2220.98C1237.64 2958.34 1710.34 2958.34 1737.16 2220.98C1739.58 2155.13 1717.16 2090.34 1673.52 2040.69C1672.62 2039.63 1671.86 2038.72 1670.95 2037.66C1566.41 1918.38 1381.57 1918.38 1277.03 2037.66C1276.12 2038.72 1275.37 2039.63 1274.46 2040.69C1230.82 2090.19 1208.55 2154.98 1210.82 2220.98Z" fill="white"/><circle cx="1474.5" cy="1474.5" r="886.5" fill="white"/><path d="M1391.06 1500C1391.06 1352.11 1358.4 1218.38 1305.74 1121.72C1253.03 1024.95 1180.69 966 1101.53 966C1022.36 966 950.031 1024.95 897.314 1121.72C844.66 1218.38 812 1352.11 812 1500C812 1647.89 844.66 1781.62 897.314 1878.28C950.031 1975.05 1022.36 2034 1101.53 2034C1180.69 2034 1253.03 1975.05 1305.74 1878.28C1358.4 1781.62 1391.06 1647.89 1391.06 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="126.414" cy="231.934" rx="126.414" ry="231.934" transform="matrix(1 0 0 -1 976.16 2037)" fill="white"/><path d="M2187.16 1500C2187.16 1352.11 2154.5 1218.38 2101.84 1121.72C2049.12 1024.95 1976.79 966 1897.63 966C1818.46 966 1746.13 1024.95 1693.41 1121.72C1640.76 1218.38 1608.1 1352.11 1608.1 1500C1608.1 1647.89 1640.76 1781.62 1693.41 1878.28C1746.13 1975.05 1818.46 2034 1897.63 2034C1976.79 2034 2049.12 1975.05 2101.84 1878.28C2154.5 1781.62 2187.16 1647.89 2187.16 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="126.414" cy="231.934" rx="126.414" ry="231.934" transform="matrix(1 0 0 -1 1770.17 2037)" fill="white"/></g><defs><clipPath id="clip0_5569_72809"><rect width="3000" height="3000" fill="white"/></clipPath></defs></svg>`;
var BASE_DEFAULT_PROFILE_PICTURES3 = `<svg width="3000" height="3000" viewBox="0 0 3000 3000" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5569_72826)"><rect width="3000" height="3000" fill="#155DFD"/><circle cx="1500" cy="1500" r="1500" fill="#155DFD"/><path d="M587.596 2230.75C839.799 2148.27 1126.41 2048.74 1282.85 1934.35C1406.13 1849.79 1458.98 1757.13 1483.16 1651.34C1488.13 1629.73 1511.93 1629.73 1516.8 1651.34C1540.98 1757.01 1593.83 1849.67 1717.11 1934.35C1873.55 2048.74 2160.26 2148.28 2412.36 2230.75C2681.77 2308.44 2735.86 2334.34 2656.73 2207.31C2588.97 2088.63 2388.28 1817.51 2407.39 1489.82C2407.39 1489.21 2407.39 1488.59 2407.39 1487.86C2397.17 1162.25 2598.34 899.36 2662.18 786.079C2737.77 664.821 2675.65 693.54 2406.72 771.597C2154.43 854.195 1870.3 953.362 1715.2 1067.5C1593.25 1151.7 1540.79 1203.99 1516.8 1309.05C1511.83 1330.65 1488.03 1330.65 1483.16 1309.05C1459.17 1203.87 1406.71 1151.7 1284.76 1067.5C1129.66 953.362 845.533 854.195 593.234 771.597C324.307 693.54 262.284 664.821 337.782 786.079C401.621 899.36 602.791 1162.37 592.47 1488.1C592.47 1488.72 592.47 1489.33 592.47 1490.07C611.583 1817.76 410.891 2088.87 343.134 2207.55C264.004 2334.46 318.095 2308.68 587.5 2231L587.596 2230.75Z" fill="white"/><path d="M769.249 587.596C851.725 839.799 951.26 1126.41 1065.65 1282.85C1150.21 1406.13 1242.87 1458.98 1348.66 1483.16C1370.26 1488.13 1370.26 1511.93 1348.66 1516.8C1242.99 1540.98 1150.33 1593.83 1065.65 1717.11C951.26 1873.55 851.725 2160.26 769.249 2412.36C691.56 2681.77 665.664 2735.86 792.691 2656.73C911.372 2588.97 1182.49 2388.28 1510.18 2407.39C1510.79 2407.39 1511.41 2407.39 1512.14 2407.39C1837.75 2397.17 2100.64 2598.34 2213.92 2662.18C2335.18 2737.77 2306.46 2675.65 2228.4 2406.72C2145.8 2154.43 2046.64 1870.3 1932.5 1715.2C1848.3 1593.25 1796.01 1540.79 1690.95 1516.8C1669.35 1511.83 1669.35 1488.03 1690.95 1483.16C1796.13 1459.17 1848.3 1406.71 1932.5 1284.76C2046.64 1129.66 2145.8 845.533 2228.4 593.234C2306.46 324.307 2335.18 262.284 2213.92 337.782C2100.64 401.621 1837.63 602.791 1511.9 592.47C1511.28 592.47 1510.67 592.47 1509.93 592.47C1182.24 611.583 911.127 410.891 792.446 343.134C665.541 264.004 691.315 318.095 769.004 587.5L769.249 587.596Z" fill="white"/><path d="M1391.06 1500C1391.06 1352.11 1358.4 1218.38 1305.74 1121.72C1253.03 1024.95 1180.69 966 1101.53 966C1022.36 966 950.031 1024.95 897.314 1121.72C844.66 1218.38 812 1352.11 812 1500C812 1647.89 844.66 1781.62 897.314 1878.28C950.031 1975.05 1022.36 2034 1101.53 2034C1180.69 2034 1253.03 1975.05 1305.74 1878.28C1358.4 1781.62 1391.06 1647.89 1391.06 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="126.414" cy="231.934" rx="126.414" ry="231.934" transform="matrix(1 0 0 -1 976.159 2037)" fill="white"/><path d="M2187.16 1500C2187.16 1352.11 2154.5 1218.38 2101.84 1121.72C2049.12 1024.95 1976.79 966 1897.63 966C1818.46 966 1746.13 1024.95 1693.41 1121.72C1640.76 1218.38 1608.1 1352.11 1608.1 1500C1608.1 1647.89 1640.76 1781.62 1693.41 1878.28C1746.13 1975.05 1818.46 2034 1897.63 2034C1976.79 2034 2049.12 1975.05 2101.84 1878.28C2154.5 1781.62 2187.16 1647.89 2187.16 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="126.414" cy="231.934" rx="126.414" ry="231.934" transform="matrix(1 0 0 -1 1770.17 2037)" fill="white"/></g><defs><clipPath id="clip0_5569_72826"><rect width="3000" height="3000" fill="white"/></clipPath></defs></svg>`;
var BASE_DEFAULT_PROFILE_PICTURES4 = `<svg width="3000" height="3000" viewBox="0 0 3000 3000" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5569_72835)"><rect width="3000" height="3000" fill="#155DFD"/><circle cx="1500" cy="1500" r="1500" fill="#155DFD"/><path d="M2713.13 1500C2731.2 1680.92 2615.13 1818.15 2507.78 1924.42C2394.7 2032.13 2290.44 2108.88 2200.88 2200.61C2109.15 2290.16 2032.22 2394.61 1924.51 2507.68C1818.15 2615.04 1680.92 2731.11 1500 2713.13C1319.08 2731.2 1181.85 2615.13 1075.58 2507.78C967.866 2394.7 891.12 2290.44 799.389 2200.88C709.837 2109.15 605.39 2032.22 492.315 1924.51C384.962 1818.15 268.89 1680.92 286.873 1500C268.799 1319.08 384.871 1181.85 492.224 1075.58C605.299 967.866 709.564 891.12 799.116 799.389C890.848 709.837 967.775 605.39 1075.49 492.315C1181.85 384.871 1319.08 268.799 1500 286.873C1680.92 268.799 1818.15 384.871 1924.42 492.224C2032.13 605.299 2108.88 709.564 2200.61 799.116C2290.16 890.848 2394.61 967.775 2507.68 1075.49C2615.04 1181.85 2731.11 1319.08 2713.13 1500Z" fill="white"/><path d="M1391.06 1500C1391.06 1647.89 1358.4 1781.62 1305.74 1878.28C1253.03 1975.05 1180.69 2034 1101.53 2034C1022.36 2034 950.031 1975.05 897.314 1878.28C844.66 1781.62 812 1647.89 812 1500C812 1352.11 844.66 1218.38 897.314 1121.72C950.031 1024.95 1022.36 966 1101.53 966C1180.69 966 1253.03 1024.95 1305.74 1121.72C1358.4 1218.38 1391.06 1352.11 1391.06 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="1102.57" cy="1194.93" rx="126.414" ry="231.934" fill="white"/><path d="M2187.16 1500C2187.16 1647.89 2154.5 1781.62 2101.84 1878.28C2049.12 1975.05 1976.79 2034 1897.63 2034C1818.46 2034 1746.13 1975.05 1693.41 1878.28C1640.76 1781.62 1608.1 1647.89 1608.1 1500C1608.1 1352.11 1640.76 1218.38 1693.41 1121.72C1746.13 1024.95 1818.46 966 1897.63 966C1976.79 966 2049.12 1024.95 2101.84 1121.72C2154.5 1218.38 2187.16 1352.11 2187.16 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="1896.58" cy="1194.93" rx="126.414" ry="231.934" fill="white"/></g><defs><clipPath id="clip0_5569_72835"><rect width="3000" height="3000" fill="white"/></clipPath></defs></svg>`;
var BASE_DEFAULT_PROFILE_PICTURES5 = `<svg width="3000" height="3000" viewBox="0 0 3000 3000" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5569_72843)"><rect width="3000" height="3000" fill="#155DFD"/><circle cx="1500" cy="1500" r="1500" fill="#155DFD"/><path d="M2321.64 1500C3048.65 1727.51 2902.59 1900.1 2182.54 1787.44C2625.43 2169.27 2494.23 2265.93 1974.71 1974.53C2266.19 2493.97 2169.44 2625.34 1787.53 2182.54C1900.19 2902.68 1727.6 3048.65 1500 2321.64C1272.49 3048.65 1099.9 2902.59 1212.56 2182.54C830.733 2625.43 734.069 2494.23 1025.47 1974.71C506.03 2266.19 374.655 2169.44 817.464 1787.53C97.3173 1900.19 -48.6455 1727.6 678.356 1500C-48.6455 1272.49 97.4051 1099.9 817.464 1212.56C374.567 830.733 505.767 734.069 1025.29 1025.47C733.806 506.03 830.558 374.655 1212.47 817.464C1099.81 97.3173 1272.4 -48.6455 1500 678.356C1727.51 -48.6455 1900.1 97.4051 1787.44 817.464C2169.27 374.567 2265.93 505.767 1974.53 1025.29C2493.97 733.806 2625.34 830.558 2182.54 1212.47C2902.68 1099.81 3048.65 1272.4 2321.64 1500Z" fill="white"/><path d="M1402.29 1500.15C1402.29 1632.88 1372.98 1752.91 1325.73 1839.64C1278.42 1926.48 1213.56 1979.29 1142.65 1979.29C1071.73 1979.29 1006.87 1926.48 959.562 1839.64C912.315 1752.91 883 1632.88 883 1500.15C883 1367.41 912.315 1247.38 959.562 1160.65C1006.87 1073.81 1071.73 1021 1142.65 1021C1213.56 1021 1278.42 1073.81 1325.73 1160.65C1372.98 1247.38 1402.29 1367.41 1402.29 1500.15Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="998.466" cy="1500.14" rx="113.501" ry="208.242" fill="white"/><path d="M2117.07 1500.15C2117.07 1632.88 2087.76 1752.91 2040.51 1839.64C1993.2 1926.48 1928.34 1979.29 1857.42 1979.29C1786.51 1979.29 1721.65 1926.48 1674.34 1839.64C1627.09 1752.91 1597.78 1632.88 1597.78 1500.15C1597.78 1367.41 1627.09 1247.38 1674.34 1160.65C1721.65 1073.81 1786.51 1021 1857.42 1021C1928.34 1021 1993.2 1073.81 2040.51 1160.65C2087.76 1247.38 2117.07 1367.41 2117.07 1500.15Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="1712.74" cy="1498.06" rx="113.501" ry="208.242" fill="white"/></g><defs><clipPath id="clip0_5569_72843"><rect width="3000" height="3000" fill="white"/></clipPath></defs></svg>`;
var BASE_DEFAULT_PROFILE_PICTURES6 = `<svg width="3000" height="3000" viewBox="0 0 3000 3000" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5569_72851)"><rect width="3000" height="3000" fill="#155DFD"/><circle cx="1500" cy="1500" r="1500" fill="#155DFD"/><path d="M2538.7 1207.34C2483.17 1184.33 2431.23 1159.94 2382.18 1133.9C2398.44 1080.86 2417.87 1026.85 2440.88 971.324C2548.89 711.06 2287.94 450.106 2027.68 558.125C1972.15 581.134 1918.14 600.699 1865.1 616.819C1839.06 567.907 1814.67 515.827 1791.66 460.302C1684.05 199.899 1314.94 199.899 1207.34 460.302C1184.33 515.827 1159.94 567.769 1133.9 616.819C1080.86 600.561 1026.85 581.134 971.324 558.125C711.06 450.106 450.106 711.06 558.125 971.324C581.134 1026.85 600.699 1080.86 616.819 1133.9C567.907 1159.94 515.827 1184.33 460.302 1207.34C199.899 1314.94 199.899 1684.05 460.302 1791.66C515.827 1814.67 567.769 1839.06 616.819 1865.1C600.561 1918.14 581.134 1972.15 558.125 2027.68C450.106 2287.94 711.06 2548.89 971.324 2440.88C1026.85 2417.87 1080.86 2398.3 1133.9 2382.18C1159.94 2431.09 1184.33 2483.17 1207.34 2538.7C1314.94 2799.1 1684.05 2799.1 1791.66 2538.7C1814.67 2483.17 1839.06 2431.23 1865.1 2382.18C1918.14 2398.44 1972.15 2417.87 2027.68 2440.88C2287.94 2548.89 2548.89 2287.94 2440.88 2027.68C2417.87 1972.15 2398.3 1918.14 2382.18 1865.1C2431.09 1839.06 2483.17 1814.67 2538.7 1791.66C2799.1 1684.05 2799.1 1314.94 2538.7 1207.34ZM1735.31 1727.87C1732.83 1730.35 1730.35 1732.83 1727.87 1735.31C1697.42 1766.58 1662.15 1790.01 1624.53 1806.13C1587.47 1820.46 1547.24 1828.17 1504.94 1827.62C1501.36 1827.62 1497.92 1827.62 1494.33 1827.62C1452.04 1828.17 1411.67 1820.32 1374.74 1806.13C1337.13 1790.01 1301.86 1766.58 1271.41 1735.31C1268.93 1732.83 1266.45 1730.35 1263.97 1727.87C1232.69 1697.42 1209.27 1662.15 1193.15 1624.53C1178.82 1587.61 1171.1 1547.24 1171.65 1504.94C1171.65 1501.36 1171.65 1497.92 1171.65 1494.33C1171.1 1452.04 1178.96 1411.67 1193.15 1374.74C1209.27 1337.13 1232.69 1301.86 1263.97 1271.41C1266.45 1268.93 1268.93 1266.45 1271.41 1263.97C1301.86 1232.69 1337.13 1209.27 1374.74 1193.15C1411.67 1178.82 1452.04 1171.1 1494.33 1171.65C1497.92 1171.65 1501.36 1171.65 1504.94 1171.65C1547.24 1171.1 1587.61 1178.96 1624.53 1193.15C1662.15 1209.27 1697.42 1232.69 1727.87 1263.97C1730.35 1266.45 1732.83 1268.93 1735.31 1271.41C1766.58 1301.86 1790.01 1337.13 1806.13 1374.74C1820.46 1411.8 1828.17 1452.04 1827.62 1494.33C1827.62 1497.92 1827.62 1501.36 1827.62 1504.94C1828.17 1547.24 1820.32 1587.61 1806.13 1624.53C1790.01 1662.15 1766.58 1697.42 1735.31 1727.87Z" fill="white"/><circle cx="1476" cy="1442" r="443" fill="white"/><path d="M1400.59 1202.5C1400.59 1334.79 1371.37 1454.31 1324.38 1540.58C1277.28 1627.04 1213.04 1679 1143.3 1679C1073.56 1679 1009.31 1627.04 962.215 1540.58C915.221 1454.31 886 1334.79 886 1202.5C886 1070.21 915.221 950.688 962.215 864.42C1009.31 777.961 1073.56 726 1143.3 726C1213.04 726 1277.28 777.961 1324.38 864.42C1371.37 950.688 1400.59 1070.21 1400.59 1202.5Z" fill="#155DFD" stroke="white" stroke-width="10"/><ellipse cx="1141.26" cy="931.03" rx="113.349" ry="207.963" fill="white"/><path d="M2114.41 1202.5C2114.41 1334.79 2085.19 1454.31 2038.19 1540.58C1991.1 1627.04 1926.85 1679 1857.11 1679C1787.37 1679 1723.13 1627.04 1676.03 1540.58C1629.04 1454.31 1599.82 1334.79 1599.82 1202.5C1599.82 1070.21 1629.04 950.688 1676.03 864.42C1723.13 777.961 1787.37 726 1857.11 726C1926.85 726 1991.1 777.961 2038.19 864.42C2085.19 950.688 2114.41 1070.21 2114.41 1202.5Z" fill="#155DFD" stroke="white" stroke-width="10"/><ellipse cx="1861.96" cy="928.963" rx="113.349" ry="207.963" fill="white"/></g><defs><clipPath id="clip0_5569_72851"><rect width="3000" height="3000" fill="white"/></clipPath></defs></svg>`;
var BASE_DEFAULT_PROFILE_PICTURES7 = `<svg width="3000" height="3000" viewBox="0 0 3000 3000" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5569_72860)"><rect width="3000" height="3000" fill="#155DFD"/><circle cx="1500" cy="1500" r="1500" fill="#155DFD"/><path d="M1500.19 1499.87C1365.57 1351.79 1298.1 1205.48 1296.93 988.1C1296.16 779.052 1361.71 498.983 1502.29 274.909C1565.01 170.441 1645.1 119.866 1696.41 125.097C1750.22 129.37 1775.2 189.413 1785.5 284.511C1806.04 473.278 1775.29 803.798 1990.99 1009.07C2196.26 1224.77 2526.78 1194.09 2715.59 1214.68C2810.65 1224.78 2870.69 1249.84 2874.93 1303.61C2880.12 1354.96 2829.55 1435.05 2725.08 1497.77C2501.01 1638.35 2220.94 1703.91 2011.89 1703.13C1794.55 1702 1648.19 1634.49 1500.12 1499.87L1500.19 1499.87Z" fill="white"/><path d="M1499.98 1500.01C1634.61 1648.08 1702.07 1794.4 1703.24 2011.77C1704.02 2220.82 1638.47 2500.89 1497.89 2724.97C1435.16 2829.43 1355.07 2880.01 1303.77 2874.78C1249.96 2870.5 1224.97 2810.46 1214.68 2715.36C1194.13 2526.6 1224.89 2196.08 1009.18 1990.81C803.914 1775.1 473.394 1805.78 284.59 1785.2C189.528 1775.09 129.486 1750.03 125.249 1696.26C120.055 1644.91 170.63 1564.82 275.098 1502.1C499.172 1361.52 779.24 1295.97 988.289 1296.75C1205.63 1297.88 1351.98 1365.38 1500.06 1500.01L1499.98 1500.01Z" fill="white"/><path d="M1481.64 1518.29C1630.16 1383.18 1776.72 1315.24 1994.12 1313.37C2203.19 1311.92 2483.08 1376.57 2706.72 1516.45C2811 1578.84 2861.32 1658.78 2855.93 1710.11C2851.48 1763.93 2791.35 1789.12 2696.21 1799.72C2507.36 1820.87 2176.9 1791.18 1970.91 2007.57C1754.52 2213.55 1784.15 2544.01 1762.95 2732.9C1752.54 2828.01 1727.28 2888.14 1673.49 2892.55C1622.12 2897.91 1542.19 2847.58 1479.79 2743.31C1339.92 2519.66 1275.26 2239.77 1276.71 2030.7C1278.54 1813.33 1346.52 1666.75 1481.64 1518.22L1481.64 1518.29Z" fill="white"/><path d="M1481.81 1518.43C1333.29 1653.54 1186.74 1721.48 969.339 1723.34C760.267 1724.79 480.38 1660.13 256.734 1520.25C152.457 1457.85 102.133 1377.92 107.529 1326.59C111.975 1272.76 172.103 1247.58 267.243 1236.98C456.094 1215.83 786.549 1245.53 992.528 1029.15C1208.91 823.167 1179.28 492.713 1200.47 303.825C1210.92 208.685 1236.11 148.557 1289.93 144.111C1341.3 138.752 1421.23 189.076 1483.63 293.353C1623.51 516.999 1688.17 796.885 1686.72 1005.96C1684.9 1223.32 1616.92 1369.91 1481.81 1518.43Z" fill="white"/><path d="M1403.24 1500C1403.24 1630.77 1374.36 1749 1327.82 1834.44C1281.21 1919.99 1217.33 1972 1147.49 1972C1077.65 1972 1013.76 1919.99 967.153 1834.44C920.611 1749 891.731 1630.77 891.731 1500C891.731 1369.23 920.611 1251 967.153 1165.56C1013.76 1080.01 1077.65 1028 1147.49 1028C1217.33 1028 1281.21 1080.01 1327.82 1165.56C1374.36 1251 1403.24 1369.23 1403.24 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="1148.41" cy="1230.16" rx="111.819" ry="205.156" fill="white"/><path d="M2107.42 1500C2107.42 1630.77 2078.55 1749 2032 1834.44C1985.4 1919.99 1921.51 1972 1851.67 1972C1781.83 1972 1717.94 1919.99 1671.34 1834.44C1624.79 1749 1595.92 1630.77 1595.92 1500C1595.92 1369.23 1624.79 1251 1671.34 1165.56C1717.94 1080.01 1781.83 1028 1851.67 1028C1921.51 1028 1985.4 1080.01 2032 1165.56C2078.55 1251 2107.42 1369.23 2107.42 1500Z" fill="#155DFD" stroke="white" stroke-width="6"/><ellipse cx="1850.75" cy="1230.16" rx="111.819" ry="205.156" fill="white"/></g><defs><clipPath id="clip0_5569_72860"><rect width="3000" height="3000" fill="white"/></clipPath></defs></svg>`;
var BASE_DEFAULT_PROFILE_PICTURES = [
  BASE_DEFAULT_PROFILE_PICTURES1,
  BASE_DEFAULT_PROFILE_PICTURES2,
  BASE_DEFAULT_PROFILE_PICTURES3,
  BASE_DEFAULT_PROFILE_PICTURES4,
  BASE_DEFAULT_PROFILE_PICTURES5,
  BASE_DEFAULT_PROFILE_PICTURES6,
  BASE_DEFAULT_PROFILE_PICTURES7
];

// src/identity/utils/getBaseDefaultProfilePictureIndex.tsx
import { sha256 } from "viem";
var getBaseDefaultProfilePictureIndex = /* @__PURE__ */ __name((name, optionsLength) => {
  const nameAsUint8Array = Uint8Array.from(name.split("").map((letter) => letter.charCodeAt(0)));
  const hash = sha256(nameAsUint8Array);
  const hashValue = Number.parseInt(hash, 16);
  const remainder = hashValue % optionsLength;
  const index = remainder;
  return index;
}, "getBaseDefaultProfilePictureIndex");

// src/identity/utils/getBaseDefaultProfilePicture.tsx
var getBaseDefaultProfilePicture = /* @__PURE__ */ __name((username) => {
  const profilePictureIndex = getBaseDefaultProfilePictureIndex(username, BASE_DEFAULT_PROFILE_PICTURES.length);
  const selectedProfilePicture = BASE_DEFAULT_PROFILE_PICTURES[profilePictureIndex];
  const base64Svg = btoa(selectedProfilePicture);
  const dataUri = `data:image/svg+xml;base64,${base64Svg}`;
  return dataUri;
}, "getBaseDefaultProfilePicture");

// src/identity/utils/isBasename.tsx
var isBasename = /* @__PURE__ */ __name((username) => {
  if (username.endsWith(".base.eth")) {
    return true;
  }
  if (username.endsWith(".basetest.eth")) {
    return true;
  }
  return false;
}, "isBasename");

// src/identity/utils/getAvatar.ts
var getAvatar = /* @__PURE__ */ __name(async ({ ensName, chain = mainnet2 }) => {
  const chainIsBase = isBase({
    chainId: chain.id
  });
  const chainIsEthereum = isEthereum({
    chainId: chain.id
  });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;
  const usernameIsBasename = isBasename(ensName);
  if (!chainSupportsUniversalResolver) {
    return Promise.reject("ChainId not supported, avatar resolution is only supported on Ethereum and Base.");
  }
  let client = getChainPublicClient(chain);
  let baseEnsAvatar = null;
  if (chainIsBase) {
    try {
      baseEnsAvatar = await client.getEnsAvatar({
        name: normalize(ensName),
        universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id]
      });
      if (baseEnsAvatar) {
        return baseEnsAvatar;
      }
    } catch (_error) {
    }
  }
  client = getChainPublicClient(mainnet2);
  const mainnetEnsAvatar = await client.getEnsAvatar({
    name: normalize(ensName)
  });
  if (mainnetEnsAvatar) {
    return mainnetEnsAvatar;
  }
  if (usernameIsBasename) {
    return getBaseDefaultProfilePicture(ensName);
  }
  return null;
}, "getAvatar");

// src/identity/hooks/useAvatar.ts
var useAvatar = /* @__PURE__ */ __name(({ ensName, chain = mainnet3 }, queryOptions) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const ensActionKey = `ens-avatar-${ensName}-${chain.id}`;
  return useQuery({
    queryKey: [
      "useAvatar",
      ensActionKey
    ],
    queryFn: /* @__PURE__ */ __name(async () => {
      return getAvatar({
        ensName,
        chain
      });
    }, "queryFn"),
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false
  });
}, "useAvatar");

// src/identity/hooks/useName.ts
import { useQuery as useQuery2 } from "@tanstack/react-query";
import { mainnet as mainnet6 } from "viem/chains";

// src/identity/utils/getName.ts
import { base as base3, mainnet as mainnet5 } from "viem/chains";

// src/identity/abis/L2ResolverAbi.ts
var L2ResolverAbi_default = [
  {
    inputs: [
      {
        internalType: "contract ENS",
        name: "ens_",
        type: "address"
      },
      {
        internalType: "address",
        name: "registrarController_",
        type: "address"
      },
      {
        internalType: "address",
        name: "reverseRegistrar_",
        type: "address"
      },
      {
        internalType: "address",
        name: "owner_",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "AlreadyInitialized",
    type: "error"
  },
  {
    inputs: [],
    name: "CantSetSelfAsDelegate",
    type: "error"
  },
  {
    inputs: [],
    name: "CantSetSelfAsOperator",
    type: "error"
  },
  {
    inputs: [],
    name: "NewOwnerIsZeroAddress",
    type: "error"
  },
  {
    inputs: [],
    name: "NoHandoverRequest",
    type: "error"
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "contentType",
        type: "uint256"
      }
    ],
    name: "ABIChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "address",
        name: "a",
        type: "address"
      }
    ],
    name: "AddrChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "coinType",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "newAddress",
        type: "bytes"
      }
    ],
    name: "AddressChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool"
      }
    ],
    name: "ApprovalForAll",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "address",
        name: "delegate",
        type: "address"
      },
      {
        indexed: true,
        internalType: "bool",
        name: "approved",
        type: "bool"
      }
    ],
    name: "Approved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "hash",
        type: "bytes"
      }
    ],
    name: "ContenthashChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes"
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "resource",
        type: "uint16"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "record",
        type: "bytes"
      }
    ],
    name: "DNSRecordChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes"
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "resource",
        type: "uint16"
      }
    ],
    name: "DNSRecordDeleted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "lastzonehash",
        type: "bytes"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "zonehash",
        type: "bytes"
      }
    ],
    name: "DNSZonehashChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4"
      },
      {
        indexed: false,
        internalType: "address",
        name: "implementer",
        type: "address"
      }
    ],
    name: "InterfaceChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string"
      }
    ],
    name: "NameChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pendingOwner",
        type: "address"
      }
    ],
    name: "OwnershipHandoverCanceled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pendingOwner",
        type: "address"
      }
    ],
    name: "OwnershipHandoverRequested",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "x",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "y",
        type: "bytes32"
      }
    ],
    name: "PubkeyChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newRegistrarController",
        type: "address"
      }
    ],
    name: "RegistrarControllerUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newReverseRegistrar",
        type: "address"
      }
    ],
    name: "ReverseRegistrarUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "string",
        name: "indexedKey",
        type: "string"
      },
      {
        indexed: false,
        internalType: "string",
        name: "key",
        type: "string"
      },
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string"
      }
    ],
    name: "TextChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "newVersion",
        type: "uint64"
      }
    ],
    name: "VersionChanged",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "uint256",
        name: "contentTypes",
        type: "uint256"
      }
    ],
    name: "ABI",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      }
    ],
    name: "addr",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "uint256",
        name: "coinType",
        type: "uint256"
      }
    ],
    name: "addr",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "delegate",
        type: "address"
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool"
      }
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "cancelOwnershipHandover",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      }
    ],
    name: "clearRecords",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pendingOwner",
        type: "address"
      }
    ],
    name: "completeOwnershipHandover",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      }
    ],
    name: "contenthash",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32"
      },
      {
        internalType: "uint16",
        name: "resource",
        type: "uint16"
      }
    ],
    name: "dnsRecord",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "ens",
    outputs: [
      {
        internalType: "contract ENS",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32"
      }
    ],
    name: "hasDNSRecords",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4"
      }
    ],
    name: "interfaceImplementer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "delegate",
        type: "address"
      }
    ],
    name: "isApprovedFor",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "address",
        name: "operator",
        type: "address"
      }
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]"
      }
    ],
    name: "multicall",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "nodehash",
        type: "bytes32"
      },
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]"
      }
    ],
    name: "multicallWithNodeCheck",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      }
    ],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "result",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pendingOwner",
        type: "address"
      }
    ],
    name: "ownershipHandoverExpiresAt",
    outputs: [
      {
        internalType: "uint256",
        name: "result",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      }
    ],
    name: "pubkey",
    outputs: [
      {
        internalType: "bytes32",
        name: "x",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "y",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    name: "recordVersions",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "registrarController",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "requestOwnershipHandover",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "resolve",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "reverseRegistrar",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "uint256",
        name: "contentType",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "setABI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "uint256",
        name: "coinType",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "a",
        type: "bytes"
      }
    ],
    name: "setAddr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "a",
        type: "address"
      }
    ],
    name: "setAddr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool"
      }
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes",
        name: "hash",
        type: "bytes"
      }
    ],
    name: "setContenthash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "setDNSRecords",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4"
      },
      {
        internalType: "address",
        name: "implementer",
        type: "address"
      }
    ],
    name: "setInterface",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "string",
        name: "newName",
        type: "string"
      }
    ],
    name: "setName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "x",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "y",
        type: "bytes32"
      }
    ],
    name: "setPubkey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "registrarController_",
        type: "address"
      }
    ],
    name: "setRegistrarController",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "reverseRegistrar_",
        type: "address"
      }
    ],
    name: "setReverseRegistrar",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "string",
        name: "key",
        type: "string"
      },
      {
        internalType: "string",
        name: "value",
        type: "string"
      }
    ],
    name: "setText",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "bytes",
        name: "hash",
        type: "bytes"
      }
    ],
    name: "setZonehash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4"
      }
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        internalType: "string",
        name: "key",
        type: "string"
      }
    ],
    name: "text",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      }
    ],
    name: "zonehash",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

// src/identity/utils/convertReverseNodeToBytes.ts
import { encodePacked, keccak256, namehash } from "viem";

// src/identity/utils/convertChainIdToCoinType.ts
import { mainnet as mainnet4 } from "viem/chains";
var convertChainIdToCoinType = /* @__PURE__ */ __name((chainId) => {
  if (chainId === mainnet4.id) {
    return "addr";
  }
  const cointype = (2147483648 | chainId) >>> 0;
  return cointype.toString(16).toLocaleUpperCase();
}, "convertChainIdToCoinType");

// src/identity/utils/convertReverseNodeToBytes.ts
var convertReverseNodeToBytes = /* @__PURE__ */ __name((address, chainId) => {
  const addressFormatted = address.toLocaleLowerCase();
  const addressNode = keccak256(addressFormatted.substring(2));
  const chainCoinType = convertChainIdToCoinType(chainId);
  const baseReverseNode = namehash(`${chainCoinType.toLocaleUpperCase()}.reverse`);
  const addressReverseNode = keccak256(encodePacked([
    "bytes32",
    "bytes32"
  ], [
    baseReverseNode,
    addressNode
  ]));
  return addressReverseNode;
}, "convertReverseNodeToBytes");

// src/identity/utils/getName.ts
var getName = /* @__PURE__ */ __name(async ({ address, chain = mainnet5 }) => {
  const chainIsBase = isBase({
    chainId: chain.id
  });
  const chainIsEthereum = isEthereum({
    chainId: chain.id
  });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;
  if (!chainSupportsUniversalResolver) {
    return Promise.reject("ChainId not supported, name resolution is only supported on Ethereum and Base.");
  }
  let client = getChainPublicClient(chain);
  if (chainIsBase) {
    const addressReverseNode = convertReverseNodeToBytes(address, base3.id);
    try {
      const basename = await client.readContract({
        abi: L2ResolverAbi_default,
        address: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
        functionName: "name",
        args: [
          addressReverseNode
        ]
      });
      if (basename) {
        return basename;
      }
    } catch (_error) {
    }
  }
  client = getChainPublicClient(mainnet5);
  const ensName = await client.getEnsName({
    address
  });
  return ensName ?? null;
}, "getName");

// src/identity/hooks/useName.ts
var useName = /* @__PURE__ */ __name(({ address, chain = mainnet6 }, queryOptions) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const ensActionKey = `ens-name-${address}-${chain.id}`;
  return useQuery2({
    queryKey: [
      "useName",
      ensActionKey
    ],
    queryFn: /* @__PURE__ */ __name(async () => {
      return await getName({
        address,
        chain
      });
    }, "queryFn"),
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false
  });
}, "useName");

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

// src/identity/components/Badge.tsx
function Badge({ className }) {
  const badgeSize = "12px";
  return /* @__PURE__ */ React.createElement("span", {
    className: cn(background.primary, "rounded-full border border-transparent", className),
    "data-testid": "ockBadge",
    style: {
      height: badgeSize,
      width: badgeSize,
      maxHeight: badgeSize,
      maxWidth: badgeSize
    }
  }, badgeSvg);
}
__name(Badge, "Badge");

// src/identity/hooks/useAttestations.ts
import { useEffect as useEffect5, useState as useState6 } from "react";

// src/network/attestations.ts
import { gql } from "graphql-request";
import { getAddress } from "viem";

// src/network/createEasGraphQLClient.ts
import { GraphQLClient } from "graphql-request";

// src/network/definitions/base.ts
import { base as base4 } from "viem/chains";
var easChainBase = {
  id: base4.id,
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
function isChainSupported(chain) {
  return chain.id in easSupportedChains;
}
__name(isChainSupported, "isChainSupported");
function getChainEASGraphQLAPI(chain) {
  return easSupportedChains[chain.id]?.easGraphqlAPI ?? "";
}
__name(getChainEASGraphQLAPI, "getChainEASGraphQLAPI");

// src/network/createEasGraphQLClient.ts
function createEasGraphQLClient(chain) {
  const endpoint = getChainEASGraphQLAPI(chain);
  return new GraphQLClient(endpoint);
}
__name(createEasGraphQLClient, "createEasGraphQLClient");

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
function getAttestationQueryVariables(address, filters) {
  const checksummedAddress = getAddress(address);
  const conditions = {
    recipient: {
      equals: checksummedAddress
    },
    revoked: {
      equals: filters.revoked
    }
  };
  if (typeof filters.expirationTime === "number") {
    conditions.OR = [
      {
        expirationTime: {
          equals: 0
        }
      },
      {
        expirationTime: {
          gt: filters.expirationTime
        }
      }
    ];
  }
  if (filters?.schemas && filters.schemas.length > 0) {
    conditions.schemaId = {
      in: filters.schemas
    };
  }
  return {
    where: {
      AND: [
        conditions
      ]
    },
    distinct: [
      "schemaId"
    ],
    take: filters.limit
  };
}
__name(getAttestationQueryVariables, "getAttestationQueryVariables");
async function getAttestationsByFilter(address, chain, filters) {
  const easGraphqlClient = createEasGraphQLClient(chain);
  const attestationQueryVariables = getAttestationQueryVariables(address, filters);
  const { attestations } = await easGraphqlClient.request(attestationQuery, attestationQueryVariables);
  return attestations;
}
__name(getAttestationsByFilter, "getAttestationsByFilter");

// src/identity/utils/getAttestations.ts
async function getAttestations(address, chain, options) {
  if (!isChainSupported(chain)) {
    console.log("Error in getAttestation: Chain is not supported");
    return [];
  }
  try {
    const defaultQueryVariablesFilter = {
      revoked: false,
      expirationTime: Math.round(Date.now() / 1e3),
      limit: 10
    };
    const queryVariablesFilter = {
      ...defaultQueryVariablesFilter,
      ...options
    };
    return await getAttestationsByFilter(address, chain, queryVariablesFilter);
  } catch (error) {
    console.log(`Error in getAttestation: ${error.message}`);
    return [];
  }
}
__name(getAttestations, "getAttestations");

// src/identity/hooks/useAttestations.ts
function useAttestations({ address, chain, schemaId }) {
  if (!schemaId) {
    return [];
  }
  const [attestations, setAttestations] = useState6([]);
  useEffect5(() => {
    const fetchData = /* @__PURE__ */ __name(async () => {
      const foundAttestations = await getAttestations(address, chain, {
        schemas: [
          schemaId
        ]
      });
      setAttestations(foundAttestations);
    }, "fetchData");
    fetchData();
  }, [
    address,
    chain,
    schemaId
  ]);
  return attestations;
}
__name(useAttestations, "useAttestations");

// src/identity/components/DisplayBadge.tsx
function DisplayBadge({ children, address }) {
  const { chain, schemaId } = useOnchainKit();
  const { schemaId: contextSchemaId, address: contextAddress } = useIdentityContext();
  if (!contextSchemaId && !schemaId) {
    throw new Error("Name: a SchemaId must be provided to the OnchainKitProvider or Identity component.");
  }
  const attestations = useAttestations({
    address: address ?? contextAddress,
    chain,
    schemaId: contextSchemaId ?? schemaId
  });
  if (attestations.length === 0) {
    return null;
  }
  return children;
}
__name(DisplayBadge, "DisplayBadge");

// src/identity/components/Avatar.tsx
function Avatar({ address = null, chain, className, defaultComponent, loadingComponent, children, ...props }) {
  const { address: contextAddress, chain: contextChain } = useIdentityContext();
  const accountAddress = address ?? contextAddress;
  const accountChain = chain ?? contextChain;
  if (!accountAddress) {
    console.error("Avatar: an Ethereum address must be provided to the Identity or Avatar component.");
    return null;
  }
  const { data: name, isLoading: isLoadingName } = useName({
    address: accountAddress,
    chain: accountChain
  });
  const { data: avatar, isLoading: isLoadingAvatar } = useAvatar({
    ensName: name ?? "",
    chain: accountChain
  }, {
    enabled: !!name
  });
  const badge = useMemo5(() => {
    return Children.toArray(children).find(findComponent(Badge));
  }, [
    children
  ]);
  const defaultAvatar = defaultComponent || defaultAvatarSVG;
  const loadingAvatar = loadingComponent || defaultLoadingSVG;
  if (isLoadingName || isLoadingAvatar) {
    return /* @__PURE__ */ React.createElement("div", {
      className: cn("h-8 w-8 overflow-hidden rounded-full", className)
    }, loadingAvatar);
  }
  const displayAvatarImg = name && avatar;
  return /* @__PURE__ */ React.createElement("div", {
    className: "relative"
  }, /* @__PURE__ */ React.createElement("div", {
    "data-testid": "ockAvatar_ImageContainer",
    className: cn("h-10 w-10 overflow-hidden rounded-full", className)
  }, displayAvatarImg ? /* @__PURE__ */ React.createElement("img", {
    className: "min-h-full min-w-full object-cover",
    "data-testid": "ockAvatar_Image",
    loading: "lazy",
    width: "100%",
    height: "100%",
    decoding: "async",
    src: avatar,
    alt: name,
    ...props
  }) : defaultAvatar), badge && /* @__PURE__ */ React.createElement(DisplayBadge, {
    address: accountAddress
  }, /* @__PURE__ */ React.createElement("div", {
    "data-testid": "ockAvatar_BadgeContainer",
    className: "-bottom-0.5 -right-0.5 absolute flex h-[15px] w-[15px] items-center justify-center rounded-full bg-transparent"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex h-3 w-3 items-center justify-center"
  }, badge))));
}
__name(Avatar, "Avatar");

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

// src/wallet/hooks/useGetETHBalance.ts
import { useMemo as useMemo6 } from "react";
import { formatUnits } from "viem";
import { useBalance } from "wagmi";

// src/swap/constants.ts
var GENERAL_SWAP_ERROR_CODE = "SWAP_ERROR";
var GENERAL_SWAP_QUOTE_ERROR_CODE = "SWAP_QUOTE_ERROR";
var GENERAL_SWAP_BALANCE_ERROR_CODE = "SWAP_BALANCE_ERROR";
var LOW_LIQUIDITY_ERROR_CODE = "SWAP_QUOTE_LOW_LIQUIDITY_ERROR";
var TOO_MANY_REQUESTS_ERROR_CODE = "TOO_MANY_REQUESTS_ERROR";
var UNCAUGHT_SWAP_QUOTE_ERROR_CODE = "UNCAUGHT_SWAP_QUOTE_ERROR";
var UNCAUGHT_SWAP_ERROR_CODE = "UNCAUGHT_SWAP_ERROR";

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

// src/wallet/hooks/useGetETHBalance.ts
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

// src/identity/components/EthBalance.tsx
function EthBalance({ address, className }) {
  const { address: contextAddress } = useIdentityContext();
  if (!contextAddress && !address) {
    console.error("Address: an Ethereum address must be provided to the Identity or EthBalance component.");
    return null;
  }
  const { convertedBalance: balance, error } = useGetETHBalance(address ?? contextAddress);
  if (!balance || error) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("span", {
    "data-testid": "ockEthBalance",
    className: cn(text.label2, color.foregroundMuted, className)
  }, getRoundedAmount(balance, 4), " ETH");
}
__name(EthBalance, "EthBalance");

// src/identity/components/Identity.tsx
import { useCallback as useCallback7 } from "react";

// src/identity/components/IdentityLayout.tsx
import { Children as Children3, useMemo as useMemo8 } from "react";

// src/internal/hooks/usePreferredColorScheme.ts
import { useEffect as useEffect6, useState as useState7 } from "react";
function usePreferredColorScheme() {
  const [colorScheme, setColorScheme] = useState7("light");
  useEffect6(() => {
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

// src/identity/hooks/usePopover.ts
import { useCallback as useCallback6, useEffect as useEffect7, useState as useState8 } from "react";
function usePopover(onClick) {
  const [popoverText, setPopoverText] = useState8("Copy");
  const [showPopover, setShowPopover] = useState8(false);
  const [isHovered, setIsHovered] = useState8(false);
  const handleMouseEnter = useCallback6(() => {
    setPopoverText("Copy");
    setIsHovered(true);
  }, []);
  const handleMouseLeave = useCallback6(() => {
    setIsHovered(false);
    setShowPopover(false);
  }, []);
  const handleClick = useCallback6(async () => {
    if (onClick) {
      const result = await onClick();
      if (result) {
        setPopoverText("Copied");
        setTimeout(() => {
          setShowPopover(false);
        }, 1e3);
      }
    }
  }, [
    onClick
  ]);
  useEffect7(() => {
    let timer;
    if (isHovered) {
      timer = setTimeout(() => setShowPopover(true), 200);
    } else {
      setShowPopover(false);
    }
    return () => clearTimeout(timer);
  }, [
    isHovered
  ]);
  if (!onClick) {
    return {};
  }
  return {
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    showPopover,
    popoverText
  };
}
__name(usePopover, "usePopover");

// src/identity/components/Name.tsx
import { Children as Children2, useMemo as useMemo7 } from "react";
function Name({ address = null, className, children, chain, ...props }) {
  const { address: contextAddress, chain: contextChain } = useIdentityContext();
  if (!contextAddress && !address) {
    console.error("Name: an Ethereum address must be provided to the Identity or Name component.");
    return null;
  }
  const accountAddress = address ?? contextAddress;
  const accountChain = chain ?? contextChain;
  const { data: name, isLoading } = useName({
    address: accountAddress,
    chain: accountChain
  });
  const badge = useMemo7(() => {
    return Children2.toArray(children).find(findComponent(Badge));
  }, [
    children
  ]);
  if (isLoading) {
    return /* @__PURE__ */ React.createElement("span", {
      className
    });
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center gap-1"
  }, /* @__PURE__ */ React.createElement("span", {
    "data-testid": "ockIdentity_Text",
    className: cn(text.headline, color.foreground, className),
    ...props
  }, name || getSlicedAddress(accountAddress)), badge && /* @__PURE__ */ React.createElement(DisplayBadge, {
    address: accountAddress
  }, badge));
}
__name(Name, "Name");

// src/identity/hooks/useSocials.tsx
import { useQuery as useQuery3 } from "@tanstack/react-query";
import { mainnet as mainnet8 } from "viem/chains";

// src/identity/utils/getSocials.ts
import { mainnet as mainnet7 } from "viem/chains";
import { normalize as normalize2 } from "viem/ens";
var getSocials = /* @__PURE__ */ __name(async ({ ensName, chain = mainnet7 }) => {
  const chainIsBase = isBase({
    chainId: chain.id
  });
  const chainIsEthereum = isEthereum({
    chainId: chain.id
  });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;
  if (!chainSupportsUniversalResolver) {
    return Promise.reject("ChainId not supported, socials resolution is only supported on Ethereum and Base.");
  }
  const client = getChainPublicClient(chain);
  const normalizedName = normalize2(ensName);
  const fetchTextRecord = /* @__PURE__ */ __name(async (key) => {
    try {
      const result = await client.getEnsText({
        name: normalizedName,
        key,
        universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id]
      });
      return result || null;
    } catch (error) {
      console.warn(`Failed to fetch ENS text record for ${key}:`, error);
      return null;
    }
  }, "fetchTextRecord");
  const [twitter, github, farcaster, website] = await Promise.all([
    fetchTextRecord("com.twitter"),
    fetchTextRecord("com.github"),
    fetchTextRecord("xyz.farcaster"),
    fetchTextRecord("url")
  ]);
  return {
    twitter,
    github,
    farcaster,
    website
  };
}, "getSocials");

// src/identity/hooks/useSocials.tsx
var useSocials = /* @__PURE__ */ __name(({ ensName, chain = mainnet8 }, queryOptions) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const ensActionKey = `ens-socials-${ensName}-${chain.id}`;
  return useQuery3({
    queryKey: [
      "useSocials",
      ensActionKey
    ],
    queryFn: /* @__PURE__ */ __name(async () => {
      return getSocials({
        ensName,
        chain
      });
    }, "queryFn"),
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false
  });
}, "useSocials");

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

// src/identity/utils/getSocialPlatformDetails.tsx
var PLATFORM_CONFIG = {
  twitter: {
    href: /* @__PURE__ */ __name((value) => `https://x.com/${value}`, "href"),
    icon: twitterSvg
  },
  github: {
    href: /* @__PURE__ */ __name((value) => `https://github.com/${value}`, "href"),
    icon: githubSvg
  },
  farcaster: {
    href: /* @__PURE__ */ __name((value) => `https://warpcast.com/${value}`, "href"),
    icon: warpcastSvg
  },
  website: {
    href: /* @__PURE__ */ __name((value) => value, "href"),
    icon: websiteSvg
  }
};
function GetSocialPlatformDetails({ platform, value }) {
  const config = PLATFORM_CONFIG[platform];
  return /* @__PURE__ */ React.createElement("a", {
    href: config.href(value),
    target: "_blank",
    rel: "noopener noreferrer",
    className: cn(pressable.default, border.radius, border.default, "flex items-center justify-center p-2"),
    "data-testid": `ockSocials_${platform.charAt(0).toUpperCase() + platform.slice(1)}`
  }, /* @__PURE__ */ React.createElement("span", {
    className: "sr-only"
  }, platform), /* @__PURE__ */ React.createElement("div", {
    className: cn("flex h-4 w-4 items-center justify-center")
  }, config.icon));
}
__name(GetSocialPlatformDetails, "GetSocialPlatformDetails");

// src/identity/components/Socials.tsx
function Socials({ address, chain, className }) {
  const { address: contextAddress, chain: contextChain } = useIdentityContext();
  const accountAddress = address ?? contextAddress;
  const accountChain = chain ?? contextChain;
  if (!accountAddress) {
    console.error("Socials: an Ethereum address must be provided to the Socials component.");
    return null;
  }
  const { data: name, isLoading: isLoadingName } = useName({
    address: accountAddress,
    chain: accountChain
  });
  const { data: socials, isLoading: isLoadingSocials } = useSocials({
    ensName: name ?? "",
    chain: accountChain
  }, {
    enabled: !!name
  });
  if (isLoadingName || isLoadingSocials) {
    return /* @__PURE__ */ React.createElement("span", {
      className
    });
  }
  if (!socials || Object.values(socials).every((value) => !value)) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(border.default, "mt-2 w-full pl-1", className)
  }, /* @__PURE__ */ React.createElement("div", {
    className: "left-4 flex space-x-2"
  }, Object.entries(socials).map(([platform, value]) => value && /* @__PURE__ */ React.createElement(GetSocialPlatformDetails, {
    key: platform,
    platform,
    value
  }))));
}
__name(Socials, "Socials");

// src/identity/components/IdentityLayout.tsx
var noop = /* @__PURE__ */ __name(() => {
}, "noop");
function IdentityLayout({ children, className, onClick }) {
  const componentTheme = useTheme();
  const { avatar, name, address, ethBalance, socials } = useMemo8(() => {
    const childrenArray = Children3.toArray(children);
    return {
      avatar: childrenArray.find(findComponent(Avatar)),
      name: childrenArray.find(findComponent(Name)),
      address: childrenArray.find(findComponent(Address)),
      ethBalance: childrenArray.find(findComponent(EthBalance)),
      socials: childrenArray.find(findComponent(Socials))
    };
  }, [
    children
  ]);
  const { handleClick, handleMouseEnter, handleMouseLeave, showPopover, popoverText } = usePopover(onClick);
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(componentTheme, background.default, "flex flex-col px-4 py-1", onClick && `${pressable.default} relative`, className),
    "data-testid": "ockIdentityLayout_container",
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onKeyUp: noop,
    onKeyDown: noop
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex-shrink-0"
  }, avatar), /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-col"
  }, name, address && !ethBalance && address, !address && ethBalance && ethBalance, address && ethBalance && /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center gap-1"
  }, address, /* @__PURE__ */ React.createElement("span", {
    className: color.foregroundMuted
  }, "\xB7"), ethBalance))), socials, showPopover && /* @__PURE__ */ React.createElement("div", {
    className: cn(background.inverse, color.foreground, "absolute top-[calc(100%_-_5px)] left-[46px] z-10 rounded px-2 py-1 shadow-[0px_4px_8px_rgba(0,0,0,0.1)]"),
    "data-testid": "ockIdentityLayout_copy"
  }, popoverText, /* @__PURE__ */ React.createElement("div", {
    className: cn("absolute top-[-5px] left-6 h-0 w-0", "border-x-[5px] border-x-transparent border-b-[5px] border-b-[color:var(--ock-bg-inverse)] border-solid"),
    "data-testid": "ockIdentityLayout_copyArrow"
  })));
}
__name(IdentityLayout, "IdentityLayout");

// src/identity/components/Identity.tsx
function Identity({ address, chain, children, className, hasCopyAddressOnClick = false, schemaId }) {
  const { chain: contextChain } = useOnchainKit();
  const accountChain = chain ?? contextChain;
  const handleCopy = useCallback7(async () => {
    if (!address) {
      return false;
    }
    try {
      await navigator.clipboard.writeText(address);
      return true;
    } catch (e) {
      console.error("Failed to copy: ", e);
      return false;
    }
  }, [
    address
  ]);
  const onClick = hasCopyAddressOnClick ? handleCopy : void 0;
  return /* @__PURE__ */ React.createElement(IdentityProvider, {
    address,
    schemaId,
    chain: accountChain
  }, /* @__PURE__ */ React.createElement(IdentityLayout, {
    className,
    onClick
  }, children));
}
__name(Identity, "Identity");

// src/identity/utils/getAddress.ts
import { mainnet as mainnet9 } from "viem/chains";

// src/identity/hooks/useAddress.ts
import { useQuery as useQuery4 } from "@tanstack/react-query";
import { mainnet as mainnet10 } from "viem/chains";

// src/nft/components/view/NFTOwner.tsx
function NFTOwner({ className, label = "Owned by" }) {
  const { schemaId } = useOnchainKit();
  const { ownerAddress } = useNFTContext();
  if (!ownerAddress) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("flex items-center justify-between", text.label2, className)
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn(color.foregroundMuted)
  }, label), /* @__PURE__ */ React.createElement(Identity, {
    className: cn("!bg-inherit space-x-1 px-0"),
    address: ownerAddress,
    schemaId
  }, /* @__PURE__ */ React.createElement(Avatar, {
    className: "h-4 w-4"
  }), /* @__PURE__ */ React.createElement(Name, null, /* @__PURE__ */ React.createElement(Badge, null))));
}
__name(NFTOwner, "NFTOwner");

// src/nft/components/view/NFTTitle.tsx
function NFTTitle({ className }) {
  const { name } = useNFTContext();
  if (!name) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("pt-3 pb-1", text.title3, className)
  }, name);
}
__name(NFTTitle, "NFTTitle");

// src/nft/components/view/NFTNetwork.tsx
import { useAccount } from "wagmi";

// src/internal/svg/baseSvg.tsx
var baseSvg = /* @__PURE__ */ React.createElement("svg", {
  "data-testid": "ock-baseSvg",
  role: "img",
  "aria-label": "base",
  width: "100%",
  height: "100%",
  viewBox: "0 0 146 146",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("circle", {
  cx: "73",
  cy: "73",
  r: "73",
  fill: "#0052FF"
}), /* @__PURE__ */ React.createElement("path", {
  d: "M73.323 123.729C101.617 123.729 124.553 100.832 124.553 72.5875C124.553 44.343 101.617 21.4463 73.323 21.4463C46.4795 21.4463 24.4581 42.0558 22.271 68.2887H89.9859V76.8864H22.271C24.4581 103.119 46.4795 123.729 73.323 123.729Z",
  fill: "white"
}));

// src/nft/components/view/NFTNetwork.tsx
var networkMap = {
  Base: baseSvg
};
function NFTNetwork({ className, label = "Network" }) {
  const { chain } = useAccount();
  if (!chain || !networkMap[chain.name]) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: cn("flex items-center justify-between py-0.5", text.label2, className)
  }, /* @__PURE__ */ React.createElement("div", {
    className: cn(color.foregroundMuted)
  }, label), /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center gap-1"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "h-4 w-4 object-cover"
  }, networkMap[chain.name]), /* @__PURE__ */ React.createElement("div", null, chain.name)));
}
__name(NFTNetwork, "NFTNetwork");
export {
  NFTLastSoldPrice,
  NFTMedia,
  NFTMintDate,
  NFTNetwork,
  NFTOwner,
  NFTTitle
};
//# sourceMappingURL=index.js.map