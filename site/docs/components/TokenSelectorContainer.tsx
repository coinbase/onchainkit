import { ReactElement, cloneElement, useState } from 'react';

type TokenSelectorContainer = {
  children: ReactElement;
};

export default function TokenSelectorContainer({ children }: TokenSelectorContainer) {
  const [token, setToken] = useState();

  return cloneElement(children, { token, setToken });
}
