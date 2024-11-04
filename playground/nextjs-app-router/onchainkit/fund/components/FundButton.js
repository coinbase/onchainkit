import { useCallback } from 'react';
import { addSvg } from '../../internal/svg/addSvg.js';
import { openPopup } from '../../internal/utils/openPopup.js';
import { cn, pressable, text, border, color } from '../../styles/theme.js';
import { useTheme } from '../../useTheme.js';
import { useGetFundingUrl } from '../hooks/useGetFundingUrl.js';
import { getFundingPopupSize } from '../utils/getFundingPopupSize.js';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
function FundButton({
  className,
  disabled = false,
  fundingUrl,
  hideIcon = false,
  hideText = false,
  openIn = 'popup',
  popupSize = 'md',
  rel,
  target,
  text: buttonText = 'Fund'
}) {
  const componentTheme = useTheme();
  // If the fundingUrl prop is undefined, fallback to our recommended funding URL based on the wallet type
  const fundingUrlToRender = fundingUrl ?? useGetFundingUrl();
  const isDisabled = disabled || !fundingUrlToRender;
  const handleClick = useCallback(e => {
    e.preventDefault();
    if (fundingUrlToRender) {
      const _getFundingPopupSize = getFundingPopupSize(popupSize, fundingUrlToRender),
        height = _getFundingPopupSize.height,
        width = _getFundingPopupSize.width;
      openPopup({
        url: fundingUrlToRender,
        height,
        width,
        target
      });
    }
  }, [fundingUrlToRender, popupSize, target]);
  const classNames = cn(componentTheme, pressable.primary, 'px-4 py-3 inline-flex items-center justify-center space-x-2 disabled', isDisabled && pressable.disabled, text.headline, border.radius, color.inverse, className);
  const buttonContent = /*#__PURE__*/jsxs(Fragment, {
    children: [hideIcon || /*#__PURE__*/jsx("span", {
      className: "flex h-6 items-center",
      children: addSvg
    }), hideText || /*#__PURE__*/jsx("span", {
      children: buttonText
    })]
  });
  if (openIn === 'tab') {
    return /*#__PURE__*/jsx("a", {
      className: classNames,
      href: fundingUrlToRender
      // If openIn is 'tab', default target to _blank so we don't accidentally navigate in the current tab
      ,

      target: target ?? '_blank',
      rel: rel,
      children: buttonContent
    });
  }
  return /*#__PURE__*/jsx("button", {
    className: classNames,
    onClick: handleClick,
    type: "button",
    disabled: isDisabled,
    children: buttonContent
  });
}
export { FundButton };
//# sourceMappingURL=FundButton.js.map
