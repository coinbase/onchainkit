import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useContext } from 'react';
import { AppContext, OnchainKitComponent } from '../AppProvider';

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
          <SelectItem value={OnchainKitComponent.Identity}>Identity</SelectItem>
          <SelectItem value={OnchainKitComponent.Transaction}>
            Transaction
          </SelectItem>
          <SelectItem value={OnchainKitComponent.Swap}>Swap</SelectItem>
          <SelectItem value={OnchainKitComponent.SwapDefault}>
            SwapDefault
          </SelectItem>
          <SelectItem value={OnchainKitComponent.Wallet}>Wallet</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
