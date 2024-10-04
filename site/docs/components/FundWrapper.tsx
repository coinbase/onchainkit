'use client';
import { useOnchainKit } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

type FundWrapperChildren = {
  address: Address | undefined;
  projectId: string | undefined;
};

type FundWrapperReact = {
  children: (props: FundWrapperChildren) => ReactNode;
};

export default function FundWrapper({ children }: FundWrapperReact) {
  const { address } = useAccount();
  const { projectId } = useOnchainKit();

  return <main>{children({ address, projectId })}</main>;
}
