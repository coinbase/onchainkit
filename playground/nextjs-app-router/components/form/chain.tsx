import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useContext } from 'react';
import { AppContext } from '../AppProvider';

export function Chain() {
  const { chainId, setChainId } = useContext(AppContext);

  return (
    <div className="grid gap-2">
      <Label htmlFor="chain">Chain</Label>
      <Select
        value={chainId?.toString()}
        onValueChange={(value) =>
          value ? setChainId?.(Number.parseInt(value)) : value
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select chain" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="84532">Base Sepolia</SelectItem>
          <SelectItem value="8453">Base</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
