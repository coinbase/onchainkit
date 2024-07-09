import { TransactionProvider } from './TransactionProvider';
import type { TransactionReact } from '../types';

export function Transaction({ children }: TransactionReact) {
  return <TransactionProvider>{children}</TransactionProvider>;
}
