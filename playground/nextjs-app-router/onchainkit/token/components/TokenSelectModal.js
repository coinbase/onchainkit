function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState, useRef, useCallback, useEffect } from 'react';
import { cn, background, text } from '../../styles/theme.js';
import { TokenChip } from './TokenChip.js';
import { TokenRow } from './TokenRow.js';
import { TokenSearch } from './TokenSearch.js';
import { TokenSelectButton } from './TokenSelectButton.js';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
const backdropStyle = {
  background: 'rgba(226, 232, 240, 0.5)'
};
function TokenSelectModalInner({
  setToken,
  closeModal,
  options
}) {
  const _useState = useState(options),
    _useState2 = _slicedToArray(_useState, 2),
    filteredTokens = _useState2[0],
    setFilteredTokens = _useState2[1];
  const modalRef = useRef(null);
  const handleClick = useCallback(token => {
    setToken(token);
    closeModal();
  }, [setToken, closeModal]);
  const handleChange = useCallback(text => {
    setFilteredTokens(options.filter(({
      address,
      name,
      symbol
    }) => {
      return address.toLowerCase().startsWith(text) || name.toLowerCase().includes(text) || symbol.toLowerCase().includes(text);
    }));
  }, [options]);

  /* v8 ignore next 10 */
  const handleBlur = useCallback(event => {
    const isOutsideModal = modalRef.current && !modalRef.current.contains(event.target);
    if (isOutsideModal) {
      closeModal();
    }
  }, [closeModal]);
  useEffect(() => {
    // NOTE: this ensures that handleBlur doesn't get called on initial mount
    //       We need to use non-div elements to properly handle onblur events
    setTimeout(() => {
      document.addEventListener('click', handleBlur);
    }, 0);
    return () => {
      document.removeEventListener('click', handleBlur);
    };
  }, [handleBlur]);
  return /*#__PURE__*/jsx("div", {
    "data-testid": "ockTokenSelectModal_Inner",
    className: "fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center",
    style: backdropStyle,
    children: /*#__PURE__*/jsxs("div", {
      ref: modalRef,
      className: cn(background.default, 'flex w-[475px] flex-col gap-3 rounded-3xl p-6'),
      children: [/*#__PURE__*/jsxs("div", {
        className: "flex items-center justify-between",
        children: [/*#__PURE__*/jsx("span", {
          className: text.title3,
          children: "Select a token"
        }), /*#__PURE__*/jsx("button", {
          "data-testid": "TokenSelectModal_CloseButton",
          type: "button",
          onClick: closeModal,
          children: /*#__PURE__*/jsx("svg", {
            role: "img",
            "aria-label": "ock-close-icon",
            width: "16",
            height: "16",
            viewBox: "0 0 16 16",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            children: /*#__PURE__*/jsx("path", {
              d: "M2.3352 1L1 2.33521L6.66479 8L1 13.6648L2.3352 15L8 9.33521L13.6648 15L15 13.6648L9.33521 8L15 2.33521L13.6648 1L8 6.6648L2.3352 1Z",
              fill: "#0A0B0D"
            })
          })
        })]
      }), /*#__PURE__*/jsx(TokenSearch, {
        onChange: handleChange,
        delayMs: 0
      }), filteredTokens.length > 0 && /*#__PURE__*/jsx("div", {
        className: "flex flex-wrap gap-2",
        children: filteredTokens.slice(0, 4).map((token, idx) => /*#__PURE__*/jsx(TokenChip, {
          className: "shadow-none",
          token: token,
          onClick: handleClick
        }, `${token.name}${idx}`))
      }), filteredTokens.length > 0 ? /*#__PURE__*/jsxs("div", {
        className: "mt-3",
        children: [/*#__PURE__*/jsx("div", {
          className: "text-black text-body",
          children: "Tokens"
        }), /*#__PURE__*/jsx("div", {
          className: "ock-scrollbar overflow-y-auto",
          style: {
            minHeight: '300px',
            height: '300px'
          },
          children: filteredTokens.map((token, idx) => /*#__PURE__*/jsx(TokenRow, {
            token: token,
            onClick: handleClick
          }, `${token.name}${idx}`))
        })]
      }) : /*#__PURE__*/jsx("div", {
        "data-testid": "ockTokenSelectModal_NoTokens",
        className: "text-black text-body",
        style: {
          minHeight: '368px'
        },
        children: "No tokens found"
      })]
    })
  });
}
function TokenSelectModal({
  options,
  setToken,
  token
}) {
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isOpen = _useState4[0],
    setIsOpen = _useState4[1];
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);
  return /*#__PURE__*/jsxs(Fragment, {
    children: [/*#__PURE__*/jsx(TokenSelectButton, {
      onClick: openModal,
      isOpen: isOpen,
      token: token
    }), isOpen && /*#__PURE__*/jsx(TokenSelectModalInner, {
      options: options,
      setToken: setToken,
      closeModal: closeModal
    })]
  });
}
export { TokenSelectModal };
//# sourceMappingURL=TokenSelectModal.js.map
