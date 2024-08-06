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
        'flex items-center gap-2 px-4 py-2',
        className,
      )}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {baseNameSvg && (
        <div className="flex items-center justify-center w-5 h-5">
          {baseNameSvg}
        </div>
      )}
      <div className="flex items-center flex-grow">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <span className={cn(text.body, 'flex-grow')}>{title}</span>
            {!hasBaseUserName && (
              <span
                className={cn(
                  'ml-2 rounded-full bg-[#E0E7FF] px-2 text-center font-bold font-inter text-[#4F46E5] text-[0.6875rem] uppercase leading-6',
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