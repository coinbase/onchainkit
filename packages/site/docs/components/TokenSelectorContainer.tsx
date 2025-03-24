import type { Token } from '@coinbase/onchainkit/token';
import { type ReactElement, useState } from 'react';

type TokenSelectorContainer = {
  children: (token: Token, setToken: (t: Token) => void) => ReactElement;
};

export default function TokenSelectorContainer({
  children,
}: TokenSelectorContainer) {
  const [token, setToken] = useState();

  return children(token, setToken);
}
