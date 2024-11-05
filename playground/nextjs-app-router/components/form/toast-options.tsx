import { useContext } from 'react';
import { AppContext, OnchainKitComponent } from '@/components/AppProvider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export function ToastOptions() {
  const {
    activeComponent,
    toastPosition,
    setToastPosition,
    toastDurationMs,
    setToastDurationMs,
    toastTransactionHash,
    setToastTransactionHash,
    isToastVisible,
    setIsToastVisible,
  } = useContext(AppContext);

  if (activeComponent !== OnchainKitComponent.Toast) {
    return null;
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="position">Position</Label>
      <Select
        value={toastPosition}
        onValueChange={(value) =>
          setToastPosition(
            value as
              | 'bottom-center'
              | 'top-center'
              | 'top-right'
              | 'bottom-right'
          )
        }
      >
        <SelectTrigger id="position">
          <SelectValue placeholder="Select position" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="top-center">Top Center</SelectItem>
          <SelectItem value="top-right">Top Right</SelectItem>
          <SelectItem value="bottom-right">Bottom Right</SelectItem>
          <SelectItem value="bottom-center">Bottom Center</SelectItem>
        </SelectContent>
      </Select>
      <Label htmlFor="duration">Duration</Label>
      <Input
        id="durationMs"
        placeholder="Enter duration in milliseconds"
        value={toastDurationMs}
        onChange={(e) => setToastDurationMs(Number(e.target.value))}
      />
      <Label htmlFor="transactionHash">Transaction Hash</Label>
      <Input
        id="transactionHash"
        placeholder="Enter transaction hash"
        value={toastTransactionHash}
        onChange={(e) => setToastTransactionHash(e.target.value)}
      />
      <Label htmlFor="isToastVisible">Is Toast Visible</Label>
      <Switch
        id="isToastVisible"
        checked={isToastVisible}
        onCheckedChange={(checked) => setIsToastVisible(checked)}
      />
    </div>
  );
}
