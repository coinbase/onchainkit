import { useCallback, useMemo } from 'react';
import { useEffect, useState } from 'react';
import { cn, pressable, text as themeText } from '../../styles/theme';
import { version } from '../../version';
import { useIcon } from '../hooks/useIcon';
import type { WalletDropdownFundLinkReact } from '../types';
import { getWindowDimensions } from '../utils/getWindowDimensions';

export function WalletDropdownFundLink({
  className,
  icon = 'fundWallet',
  openIn = 'tab',
  popupSize = 'md',
  rel,
  target,
  text = 'Fund wallet',
}: WalletDropdownFundLinkReact) {
  const [fundingUrl, setFundingUrl] = useState('');

  const iconSvg = useIcon({ icon });

  useEffect(() => {
    const currentURL = window.location.href;
    const tabName = document.title;
    const url = `http://keys.coinbase.com/fund?dappName=${encodeURIComponent(
      tabName,
    )}&dappUrl=${encodeURIComponent(currentURL)}&version=${encodeURIComponent(
      version,
    )}&source=onchainkit`;
    setFundingUrl(url);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const { width, height } = getWindowDimensions(popupSize);

      const left = Math.round((window.screen.width - width) / 2);
      const top = Math.round((window.screen.height - height) / 2);

      const windowFeatures = `width=${width},height=${height},resizable,scrollbars=yes,status=1,left=${left},top=${top}`;
      window.open(fundingUrl, target, windowFeatures);
    },
    [fundingUrl, popupSize, target],
  );

  const overrideClassName = cn(
    pressable.default,
    'relative flex items-center px-4 py-3',
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
