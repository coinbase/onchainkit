import { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import type {
  UseSendCallsParameters,
  UseSendCallsReturnType,
} from 'wagmi/experimental';
import type { Config } from 'wagmi';

type TransactionWrapperChildren = UseSendCallsReturnType<
  Config,
  unknown
>['sendCalls']['arguments'] & {
  mutation?: UseSendCallsParameters<Config, unknown>['mutation'];
} & { address: string };

type TransactionWrapperReact = {
  children: (props: TransactionWrapperChildren) => ReactNode;
};

const myNFTABI = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'to', type: 'address' }],
    name: 'safeMint',
    outputs: [],
  },
] as const;

const myNFTAddress = '0x119Ea671030FBf79AB93b436D2E20af6ea469a19';

export default function TransactionWrapper({
  children,
}: TransactionWrapperReact) {
  const { address } = useAccount();

  const contracts = [
    {
      address: myNFTAddress,
      abi: myNFTABI,
      functionName: 'safeMint',
      args: [address],
    },
    {
      address: myNFTAddress,
      abi: myNFTABI,
      functionName: 'safeMint',
      args: [address],
    },
    ,
  ];
  return (
    <main className="flex flex-col">
      <div className="flex items-center p-4 bg-white max-w-[450px] rounded-lg">
        {children({ address, contracts })}
      </div>
    </main>
  );
}
