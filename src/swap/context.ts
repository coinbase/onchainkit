import { createContext } from 'react';
import type { SwapContextType } from './types';

export const SwapContext = createContext<SwapContextType>(
  {} as SwapContextType,
);
