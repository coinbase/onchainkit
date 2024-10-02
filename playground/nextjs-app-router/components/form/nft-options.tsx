import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContext } from 'react';
import { AppContext, OnchainKitComponent } from '../AppProvider';

export function NftOptions() {
  const { activeComponent, nftToken, setNftToken } = useContext(AppContext);

  return (
    (activeComponent === OnchainKitComponent.NftView ||
      activeComponent === OnchainKitComponent.NftMint) && (
      <div className="grid gap-2">
        <Label htmlFor="chain">Transaction Options</Label>
        <Input
          id="nftToken"
          placeholder="Enter Paymaster URL"
          value={nftToken}
          onChange={(e) => setNftToken(e.target.value)}
        />
      </div>
    )
  );
}
