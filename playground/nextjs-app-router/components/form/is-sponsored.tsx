import { useCallback, useContext } from 'react';
import { AppContext } from '../AppProvider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function IsSponsored() {
  const { isSponsored, setIsSponsored } = useContext(AppContext);

  const handleChange = useCallback(() => {
    setIsSponsored(!isSponsored);
  }, [setIsSponsored, isSponsored]);

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="sponsored mr-auto">isSponsored</Label>
        <div className="flex gap-2 items-center">
          <Switch
            id="is-sponsored"
            checked={isSponsored}
            onCheckedChange={handleChange}
          />
          <Label htmlFor="is-sponsored text-foregroundMuted">True</Label>
        </div>
      </div>
    </div>
  );
}
