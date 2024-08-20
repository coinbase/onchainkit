import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { 
  Transaction, 
  TransactionButton, 
  TransactionSponsor, 
  TransactionStatus, 
  TransactionStatusLabel, 
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction'; 
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';
import { clickContractAddress, clickContractAbi } from './constants.ts';


export default function Button() {
  const { address } = useAccount();

  const contracts = [
    {
      address: clickContractAddress,
      abi: clickContractAbi,
      functionName: 'click',
      args: [],
    },
  ];

  return address ? (
    <Transaction 
      address={address}
      contracts={contracts} 
    > 
      <TransactionButton />  
      <TransactionSponsor /> 
      <TransactionStatus>  
        <TransactionStatusLabel />  
        <TransactionStatusAction />  
      </TransactionStatus>  
    </Transaction>  
  ) : (
    <Wallet>
      <ConnectWallet>
        <Avatar className='h-6 w-6' />
        <Name />
      </ConnectWallet>
    </Wallet>
  );
}