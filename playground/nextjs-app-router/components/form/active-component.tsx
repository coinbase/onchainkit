import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OnchainKitComponent } from '@/types/onchainkit';
import { useContext } from 'react';
import { AppContext } from '../AppProvider';

export function ActiveComponent() {
  const { activeComponent, setActiveComponent } = useContext(AppContext);

  return (
    <div className="grid gap-2">
      <Label htmlFor="chain">Component</Label>
      <Select
        value={activeComponent}
        onValueChange={(value) =>
          value ? setActiveComponent?.(value as OnchainKitComponent) : value
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select component" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={OnchainKitComponent.FundButton}>
            Fund Button
          </SelectItem>
          <SelectItem value={OnchainKitComponent.FundCard}>
            Fund Card
          </SelectItem>
          <SelectItem value={OnchainKitComponent.Buy}>Buy</SelectItem>
          <SelectItem value={OnchainKitComponent.Identity}>Identity</SelectItem>
          <SelectItem value={OnchainKitComponent.IdentityCard}>
            IdentityCard
          </SelectItem>
          <SelectItem value={OnchainKitComponent.Checkout}>Checkout</SelectItem>
          <SelectItem value={OnchainKitComponent.Transaction}>
            Transaction
          </SelectItem>
          <SelectItem value={OnchainKitComponent.TransactionDefault}>
            TransactionDefault
          </SelectItem>
          <SelectItem value={OnchainKitComponent.Swap}>Swap</SelectItem>
          <SelectItem value={OnchainKitComponent.SwapDefault}>
            SwapDefault
          </SelectItem>
          <SelectItem value={OnchainKitComponent.Wallet}>Wallet</SelectItem>
          <SelectItem value={OnchainKitComponent.WalletDefault}>
            WalletDefault
          </SelectItem>
          <SelectItem value={OnchainKitComponent.WalletAdvancedDefault}>
            WalletAdvancedDefault
          </SelectItem>
          <SelectItem value={OnchainKitComponent.WalletIsland}>
            WalletIsland
          </SelectItem>
          <SelectItem value={OnchainKitComponent.NFTCard}>NFT Card</SelectItem>
          <SelectItem value={OnchainKitComponent.NFTCardDefault}>
            NFT Card Default
          </SelectItem>
          <SelectItem value={OnchainKitComponent.NFTMintCard}>
            NFT Mint Card
          </SelectItem>
          <SelectItem value={OnchainKitComponent.NFTMintCardDefault}>
            NFT Mint Card Default
          </SelectItem>
          <SelectItem value={OnchainKitComponent.Earn}>Earn</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
