import { useAccount } from 'wagmi';
import { useName } from '../../identity/hooks/useName';
import { Spinner } from '../../internal/components/Spinner';
import { baseNameSvg } from '../../internal/svg/baseNameSvg';
import { cn, pressable, text } from '../../styles/theme';
import type { WalletDropdownBaseNameReact } from '../types';
import { useWalletContext } from './WalletProvider';

export function WalletDropdownBaseName({
  className,
}: WalletDropdownBaseNameReact) {
  const { address } = useAccount();
  const { chain } = useWalletContext();

  if (!address || !chain) {
    return null;
  }

  const { data: baseName, isLoading } = useName({
    address,
    chain,
  });

  const hasBaseUserName = !!baseName;
  const title = hasBaseUserName ? 'Profile' : 'Claim Basename';
  const href = hasBaseUserName
    ? `https://www.base.org/name/${baseName}`
    : 'https://www.base.org/names';

  return (
    <a
      className={cn(
        pressable.default,
        'relative flex items-center px-4 py-3',
        className,
      )}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="-translate-y-1/2 absolute top-1/2 left-4 flex h-4 w-4 items-center justify-center">
        {baseNameSvg}
      </div>
      <div className="flex w-full items-center pl-6">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <span className={cn(text.body)}>{title}</span>
            {!hasBaseUserName && (
              <span
                className={cn(
                  'ml-2 rounded-full bg-[#E0E7FF] px-2 py-0.5 text-center font-bold font-inter text-[#4F46E5] text-[0.6875rem] uppercase leading-none',
                )}
              >
                NEW
              </span>
            )}
          </>
        )}
      </div>
    </a>
  );
}
