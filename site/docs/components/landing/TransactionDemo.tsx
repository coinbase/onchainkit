import { Avatar, Name } from '@coinbase/onchainkit/identity';
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import App from '../App.tsx';
import TransactionWrapper from '../TransactionWrapper.tsx';

export const transactionDemoCode = `
  import { useAccount } from 'wagmi';
  import { TransactionDefault } from '@coinbase/onchainkit/transaction';
  import { WalletDefault } from '@coinbase/onchainkit/wallet';

  export default function TransactionDemo() {
    const { address } = useAccount();
    const clickContractAddress = '0x67c97D1FB8184F038592b2109F854dfb09C77C75';
    const clickContractAbi = [
      {
        type: 'function',
        name: 'click',
        inputs: [],
        outputs: [],
        stateMutability: 'nonpayable',
      },
    ] as const;
    const contracts = [
      {
        address: clickContractAddress,
        abi: clickContractAbi,
        functionName: 'click',
        args: [],
      },
    ];

    return (
      <>
        {address ? (
          <TransactionDefault contracts={contracts} chainId={84532} />
        ) : (
          <WalletDefault />
        )}
      </>
    );
  }
  `;

function TransactionDemo() {
  return (
    <App>
      <TransactionWrapper>
        {({ address, contracts, onError, onSuccess }) => {
          const capabilities = {
            paymasterService: {
              url: import.meta.env.VITE_CDP_PAYMASTER_AND_BUNDLER_ENDPOINT,
            },
          };
          if (address) {
            return (
              <Transaction
                capabilities={capabilities}
                chainId={84532}
                contracts={contracts}
                onError={onError}
                onSuccess={onSuccess}
              >
                <TransactionButton className="mt-2 w-[180px] rounded-lg" />
                <TransactionSponsor />
                <TransactionStatus>
                  <TransactionStatusLabel />
                  <TransactionStatusAction />
                </TransactionStatus>
              </Transaction>
            );
          }
          return (
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
            </Wallet>
          );
        }}
      </TransactionWrapper>
    </App>
  );
}

export default TransactionDemo;
