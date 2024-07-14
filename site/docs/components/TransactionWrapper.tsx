import { ReactNode } from 'react';
import { erc20Abi } from 'viem';
import { useAccount } from 'wagmi';
import type { Abi, ContractFunctionName, Hex, Address } from 'viem';

// TODO: move to types file
type Contract = {
  address: Address;
  abi: Abi;
  functionName: ContractFunctionName;
  args?: { to: Hex; data?: Hex; value?: bigint }[];
};

type TransactionWrapperChildren = {
  address: Address | undefined;
  contracts?: Contract[];
};

type TransactionWrapperReact = {
  children: (props: TransactionWrapperChildren) => ReactNode;
};

export default function TransactionWrapper({
  children,
}: TransactionWrapperReact) {
  const { address } = useAccount();

  // TODO: replace with actual contract
  const contracts: Contract[] = [
    {
      address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
      abi: erc20Abi,
      functionName: 'approve',
    },
  ];
  return (
    <main className="flex flex-col">
      <div className="flex items-center p-4 bg-white max-w-[450px] rounded-lg">
        {children({ address, contracts })}
      </div>
    </main>
  );
}
