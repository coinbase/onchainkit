import { useCallback, useMemo } from 'react';
import { useGetFundingUrl } from '../../fund/hooks/useGetFundingUrl.js';
import { getFundingPopupSize } from '../../fund/utils/getFundingPopupSize.js';
import { useIcon } from '../../internal/hooks/useIcon.js';
import { openPopup } from '../../internal/utils/openPopup.js';
import { cn, pressable, color, text } from '../../styles/theme.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function WalletDropdownFundLink({
  className,
  fundingUrl,
  icon = 'fundWallet',
  openIn = 'popup',
  popupSize = 'md',
  rel,
  target,
  text: text$1 = 'Fund wallet'
}) {
  // If we can't get a funding URL, this component will be a no-op and render a disabled link
  const fundingUrlToRender = fundingUrl ?? useGetFundingUrl();
  const iconSvg = useIcon({
    icon
  });
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
  const overrideClassName = cn(pressable.default, color.foreground,
  // Disable hover effects if there is no funding URL
  !fundingUrlToRender && 'pointer-events-none', 'relative flex items-center px-4 py-3 w-full', className);
  const linkContent = useMemo(() => /*#__PURE__*/
  // We put disabled on the content wrapper rather than the button/link because we dont wan't to change the
  // background color of the dropdown item, just the text and icon
  jsxs("span", {
    className: cn(!fundingUrlToRender && pressable.disabled),
    children: [/*#__PURE__*/jsx("div", {
      className: "-translate-y-1/2 absolute top-1/2 left-4 flex h-[1.125rem] w-[1.125rem] items-center justify-center",
      children: iconSvg
    }), /*#__PURE__*/jsx("span", {
      className: cn(text.body, 'pl-6'),
      children: text$1
    })]
  }), [fundingUrlToRender, iconSvg, text$1]);
  if (openIn === 'tab') {
    return /*#__PURE__*/jsx("a", {
      className: overrideClassName,
      href: fundingUrlToRender,
      target: target,
      rel: rel,
      children: linkContent
    });
  }
  return /*#__PURE__*/jsx("button", {
    type: "button",
    className: overrideClassName,
    onClick: handleClick,
    children: linkContent
  });
}
export { WalletDropdownFundLink };
//# sourceMappingURL=WalletDropdownFundLink.js.map
