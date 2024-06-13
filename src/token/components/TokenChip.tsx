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
      className="flex w-fit items-center rounded-2xl bg-[#eef0f3] py-1 pl-1 pr-3 hover:bg-[#cacbce] hover:active:bg-[#bfc1c3]"
      onClick={() => onClick?.(token)}
    >
      <img className="mr-2 h-6 w-6" src={token.image || ''} />
      <span className="text-base font-medium leading-4 text-black">{token.symbol}</span>
    </button>
  );
}
