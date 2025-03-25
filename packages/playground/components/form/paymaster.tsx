import { AppContext } from '@/components/AppProvider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePaymaster } from '@/lib/hooks';
import { useContext } from 'react';

export function PaymasterUrl() {
  const { chainId, setPaymaster } = useContext(AppContext);
  const { paymasterUrl, enabled } = usePaymaster();

  function changePaymasterUrl(url: string) {
    if (!chainId) {
      console.log('Paymaster.changePaymasterUrl: chainId is not set');
      return;
    }
    setPaymaster?.(chainId, url, !!url);
  }

  function changeEnabled(enabled: boolean) {
    if (!chainId) {
      console.log('Paymaster.changeEnabled: chainId is not set');
      return;
    }
    setPaymaster?.(chainId, paymasterUrl, enabled);
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="paymaster-url">Paymaster URL (per-chain)</Label>
        <div className="flex items-center">
          <Switch
            id="paymaster-enabled"
            checked={enabled}
            disabled={!paymasterUrl}
            onCheckedChange={(enabled) => changeEnabled(enabled)}
          />
          <Label htmlFor="paymaster-enabled" className="ml-2">
            Enabled
          </Label>
        </div>
      </div>
      <Input
        id="paymaster-url"
        disabled={!chainId}
        placeholder="Enter Paymaster URL"
        value={paymasterUrl}
        onChange={(e) => changePaymasterUrl(e.target.value)}
      />
    </div>
  );
}
