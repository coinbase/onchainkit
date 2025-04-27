import type { ReactNode } from 'react';
import MintComponent from './MintComponent';
import MintLayout from './layout';

export function getLayout(page: ReactNode) {
  return <MintLayout>{page}</MintLayout>;
}

export default function Mint() {
  return <MintComponent />;
}
