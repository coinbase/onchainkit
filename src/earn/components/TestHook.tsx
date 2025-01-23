import { EarnProvider } from '@/earn/components/EarnProvider';
import { useBuildMorphoDepositTx } from '@/earn/hooks/useBuildMorphoDepositTx';
import { TransactionDefault } from '@/transaction';
import { base } from 'viem/chains';

const vaultAddress = '0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca' as const;
const address = '0x9E95f497a7663B70404496dB6481c890C4825fe1' as const;

export function TestHook() {
  const { calls } = useBuildMorphoDepositTx({
    vaultAddress,
    receiverAddress: address,
    amount: 0.25,
  });

  console.log('calls:', calls);

  return (
    <EarnProvider vaultAddress={vaultAddress}>
      <TransactionDefault calls={calls} disabled={false} chainId={base.id} />
    </EarnProvider>
  );
}
