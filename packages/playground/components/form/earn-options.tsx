import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContext } from 'react';
import { AppContext } from '../AppProvider';

export function EarnOptions() {
  const { vaultAddress, setVaultAddress } = useContext(AppContext);

  return (
    <div className="grid gap-2">
      <Label htmlFor="vaultAddress">Vault Address</Label>
      <Input
        id="vaultAddress"
        placeholder="0x1234..."
        value={vaultAddress}
        onChange={(e) => setVaultAddress(e.target.value as `0x${string}`)}
      />
    </div>
  );
}
