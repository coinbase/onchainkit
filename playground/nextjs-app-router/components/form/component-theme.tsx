import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useContext } from 'react';
import { ProviderContext } from '../OnchainProviders';

export function ComponentTheme() {
  const { componentTheme, setComponentTheme } = useContext(ProviderContext);

  return (
    <div className="grid gap-2">
      <Label htmlFor="theme">Component Theme</Label>
      <Select
        value={componentTheme}
        onValueChange={(value) =>
          setComponentTheme?.(
            value as 'light' | 'dark' | 'cyberpunk' | 'base' | 'minimal',
          )
        }
      >
        <SelectTrigger id="theme">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="base">Base</SelectItem>
          <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
          <SelectItem value="minimal">Minimal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
