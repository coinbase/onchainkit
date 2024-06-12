import { createContext } from 'react';
import { SwapContextType } from './types';

export const SwapContext = createContext<SwapContextType>({
  fromAmount: '',
  setFromAmount: () => {},
  toAmount: '',
  setToAmount: () => {},
  account: undefined,
});
