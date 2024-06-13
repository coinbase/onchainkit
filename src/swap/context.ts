import { createContext } from 'react';
import { SwapContextType } from './types';

export const SwapContext = createContext<SwapContextType>({} as SwapContextType);
