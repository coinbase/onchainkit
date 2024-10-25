import { ReactNode } from 'react';
import MintLayout from './layout';
import MintComponent from './MintComponent';

export function getLayout(page: ReactNode) {
  return <MintLayout>{page}</MintLayout>;
}

export default function Mint() {
  return <MintComponent />;
}
