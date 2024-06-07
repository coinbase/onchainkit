import { Token } from '../types';
import { TokenRow } from './TokenRow';

type TokenSelectorDropdownReact = {
  setToken: (token: Token) => void;
  options: Token[];
  onToggle: () => void;
};

export function TokenSelectorDropdown({ setToken, options, onToggle }: TokenSelectorDropdownReact) {
  return (
    <div className="ock-tokenselectordropdown-container">
      <div className="ock-tokenselectordropdown-scroll">
        {options.map((token) => (
          <TokenRow
            key={token.name + token.address}
            token={token}
            onClick={() => {
              setToken(token);
              onToggle();
            }}
            hideImage
          />
        ))}
      </div>
    </div>
  );
}
