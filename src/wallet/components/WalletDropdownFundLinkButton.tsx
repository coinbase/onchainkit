import { useCallback, useMemo } from 'react';
import { cn, pressable, text as themeText } from '../../styles/theme';
import { useIcon } from '../../useIcon';
import type { WalletDropdownFundLinkReact } from '../types';
import { getWindowDimensions } from '../utils/getWindowDimensions';

type WalletDropdownFundLinkButtonPrivateProps = {
  popupHeightOverride?: number;
  popupWidthOverride?: number;
};

export function WalletDropdownFundLinkButton({
  className,
  icon = 'fundWallet',
  openIn = 'popup',
  popupSize = 'md',
  rel,
  target,
  text = 'Fund wallet',
  fundingUrl,
  popupHeightOverride,
  popupWidthOverride,
}: Required<Pick<WalletDropdownFundLinkReact, 'fundingUrl'>> &
  WalletDropdownFundLinkReact &
  WalletDropdownFundLinkButtonPrivateProps) {
  const iconSvg = useIcon({ icon });

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      let { width, height } = getWindowDimensions(popupSize);

      if (popupHeightOverride && popupWidthOverride) {
        width = popupWidthOverride;
        height = popupHeightOverride;
      }

      const left = Math.round((window.screen.width - width) / 2);
      const top = Math.round((window.screen.height - height) / 2);

      const windowFeatures = `width=${width},height=${height},resizable,scrollbars=yes,status=1,left=${left},top=${top}`;
      window.open(fundingUrl, target, windowFeatures);
    },
    [fundingUrl, popupSize, target, popupWidthOverride, popupHeightOverride],
  );

  const overrideClassName = cn(
    pressable.default,
    'relative flex items-center px-4 py-3 w-full',
    className,
  );

  const linkContent = useMemo(
    () => (
      <>
        <div className="-translate-y-1/2 absolute top-1/2 left-4 flex h-[1.125rem] w-[1.125rem] items-center justify-center">
          {iconSvg}
        </div>
        <span className={cn(themeText.body, 'pl-6')}>{text}</span>
      </>
    ),
    [iconSvg, text],
  );

  if (openIn === 'tab') {
    return (
      <a
        className={overrideClassName}
        href={fundingUrl}
        target={target}
        rel={rel}
      >
        {linkContent}
      </a>
    );
  }
  return (
    <button type="button" className={overrideClassName} onClick={handleClick}>
      {linkContent}
    </button>
  );
}
