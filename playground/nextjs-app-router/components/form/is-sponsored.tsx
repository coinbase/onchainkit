import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCallback, useContext } from 'react';
import { AppContext } from '../AppProvider';

export function IsSponsored() {
  const { isSponsored, setIsSponsored } = useContext(AppContext);

  const handleChange = useCallback(() => {
    setIsSponsored(!isSponsored);
  }, [setIsSponsored, isSponsored]);

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="sponsored mr-auto">isSponsored</Label>
        <div className="flex items-center gap-2">
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
