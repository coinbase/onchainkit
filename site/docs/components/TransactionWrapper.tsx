import type { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import type { Config } from 'wagmi';
import type {
  UseSendCallsParameters,
  UseSendCallsReturnType,
} from 'wagmi/experimental';

type TransactionWrapperChildren = UseSendCallsReturnType<
  Config,
  unknown
>['sendCalls']['arguments'] & {
  mutation?: UseSendCallsParameters<Config, unknown>['mutation'];
} & { address: string };

type TransactionWrapperReact = {
  children: (props: TransactionWrapperChildren) => ReactNode;
};

export const clickContractAddress = '0x67c97D1FB8184F038592b2109F854dfb09C77C75';
export const clickContractAbi = [
  {
    type: 'function',
    name: 'click',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

export default function TransactionWrapper({
  children,
}: TransactionWrapperReact) {
  const { address } = useAccount();

  const contracts = [
    {
      address: clickContractAddress,
      abi: clickContractAbi,
      functionName: 'click',
      args: [],
    },
  ];

  function onError(error: Error) {
    console.error('TransactionWrapper:', error);
  }

  function onSuccess(response: any) {
    console.log('TransactionWrapperSuccessHandler', response)
  }

  return (
    <main className='flex flex-col'>
      <div className='flex max-w-[450px] items-center rounded-lg p-4 justify-center'>
        {children({ address, contracts, onError, onSuccess })}
      </div>
    </main>
  );
}
