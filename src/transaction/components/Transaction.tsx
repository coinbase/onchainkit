import type { TransactionReact } from '../types';
import { TransactionProvider } from './TransactionProvider';

export function Transaction({ children }: TransactionReact) {
  return <TransactionProvider>{children}</TransactionProvider>;
}
