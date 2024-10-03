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

type Theme = 'light' | 'dark' | 'disco';

export function ComponentTheme() {
  const { componentTheme, setComponentTheme } = useContext(AppContext);

  return (
    <div className="grid gap-2">
      <Label htmlFor="theme">Component Theme</Label>
      <Select
        value={componentTheme || 'light'}
        onValueChange={(value) =>
          value ? setComponentTheme?.(value as Theme) : value
        }
      >
        <SelectTrigger id="theme">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="disco">Disco</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
