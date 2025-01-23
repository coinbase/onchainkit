import { EarnProvider } from '@/earn/components/EarnProvider';
import { useMorphoVault } from '@/earn/hooks/useMorphoVault';

const vaultAddress = '0xa0E430870c4604CcfC7B38Ca7845B1FF653D0ff1' as const;

export function TestHook() {
  const result = useMorphoVault({ vaultAddress });
  console.log('asset:', result);

  return <EarnProvider vaultAddress={vaultAddress}>test</EarnProvider>;
}
