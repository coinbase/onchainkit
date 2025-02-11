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

interface ChainOption {
  id: number;
  name: string;
}

const DEFAULT_CHAINS: ChainOption[] = [
  { id: 84532, name: 'Base Sepolia' },
  { id: 8453, name: 'Base' },
];

interface ChainProps {
  chains?: ChainOption[];
}

export function Chain({ chains = DEFAULT_CHAINS }: ChainProps) {
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
          {chains.map((chain) => (
            <SelectItem key={chain.id} value={chain.id.toString()}>
              {chain.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
