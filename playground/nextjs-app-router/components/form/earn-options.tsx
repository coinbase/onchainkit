import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useContext } from 'react';
import { AppContext } from '../AppProvider';

export function EarnOptions() {
  const { earnVaultAddress, setEarnVaultAddress } = useContext(AppContext);

  return (
    <div className="grid gap-2">
      <Label htmlFor="vault">Vault Address</Label>
      <Input
        id="vault"
        placeholder="Enter vault address"
        value={earnVaultAddress}
        onChange={(e) => setEarnVaultAddress(e.target.value)}
      />
    </div>
  );
}
