import { TokenChipReact } from '../types';

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
      className="ock-tokenchip-button"
      onClick={() => onClick?.(token)}
    >
      <img className="ock-tokenchip-image" src={token.image || ''} />
      <span className="ock-tokenchip-label">{token.symbol}</span>
    </button>
  );
}
