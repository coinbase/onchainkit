import { text } from '../../styles/theme';
import type { TokenChipReact } from '../types';
import { TokenImage } from './TokenImage';

/**
 * Small button that display a given token symbol and image.
 *
 * WARNING: This component is under development and
 *          may change in the next few weeks.
 */
export function TokenChip({ token, onClick }: TokenChipReact) {
  return (
    <button
      type="button"
      data-testid="ockTokenChip_Button"
      className="flex w-fit shrink-0 items-center gap-2 rounded-2xl bg-[#eef0f3] py-1 pr-3 pl-1 shadow-[0px_8px_12px_0px_#5B616E1F] hover:active:bg-[#bfc1c3] hover:bg-[#cacbce]"
      onClick={() => onClick?.(token)}
    >
      <TokenImage token={token} size={24} />
      <span className={text.body}>{token.symbol}</span>
    </button>
  );
}
