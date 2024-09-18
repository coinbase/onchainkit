import { useNftContext } from "./NftProvider";
import { Transaction, TransactionButton, TransactionSponsor, TransactionStatus, TransactionStatusAction, TransactionStatusLabel } from '../../transaction';
import { base } from "viem/chains";

type NftMintButtonProps = {
  className?: string;
  label?: string;
};

export function NftMintButton({className, label = 'Mint'}: NftMintButtonProps) {
  const { mintData } = useNftContext();

  if (!mintData?.callData) {
    return null;
  }

  return (
    <Transaction chainId={base.id} calls={[{
      to: mintData.callData.to,
      data: mintData.callData.data,
      value: BigInt(mintData.callData.value) }]}>
      <TransactionButton />
      <TransactionSponsor />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  );
}
