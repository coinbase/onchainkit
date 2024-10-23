import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContext } from 'react';
import { AppContext, OnchainKitComponent } from '../AppProvider';

export function NFTOptions() {
  const { activeComponent, nftToken, setNFTToken } = useContext(AppContext);

  return (
    (activeComponent === OnchainKitComponent.NFTCard ||
      activeComponent === OnchainKitComponent.NFTMintCard) && (
      <div className="grid gap-2">
        <Label htmlFor="chain">NFT contract:tokenId</Label>
        <Input
          id="nftToken"
          placeholder="Enter contractAddress:tokenId"
          value={nftToken}
          onChange={(e) => setNFTToken(e.target.value)}
        />
      </div>
    )
  );
}
