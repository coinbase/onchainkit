import { type ReactElement, useState } from 'react';
import type { Token } from '@coinbase/onchainkit/token';

type TokenSelectorContainer = {
  children: (token: Token, setToken: (t: Token) => void) => ReactElement;
};

export default function TokenSelectorContainer({
  children,
}: TokenSelectorContainer) {
  const [token, setToken] = useState();

  return children(token, setToken);
}
