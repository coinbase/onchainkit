import { TextBody } from '../../internal/text';
import type { TokenChipReact } from '../types';

/**
 * Small button that display a given token symbol and image.
 *
 * WARNING: This component is under development and
 *          may change in the next few weeks.
 */
export function TokenChip({ token, onClick }: TokenChipReact) {
  return (
    <button
      data-testid="ockTokenChip_Button"
      className="flex w-fit items-center rounded-2xl bg-[#eef0f3] py-1 pr-3 pl-1 hover:active:bg-[#bfc1c3] hover:bg-[#cacbce] shrink-0 shadow-[0px_8px_12px_0px_#5B616E1F] "
      onClick={() => onClick?.(token)}
    >
      <img className="mr-2 h-6 w-6" src={token.image || ''} />
      <TextBody>{token.symbol}</TextBody>
    </button>
  );
}
