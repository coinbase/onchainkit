import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ComponentTheme as ComponentThemeReact } from '@/types/onchainkit';
import { useContext } from 'react';
import { AppContext } from '../AppProvider';

export function ComponentTheme() {
  const { componentTheme, setComponentTheme } = useContext(AppContext);

  return (
    <div className="grid gap-2">
      <Label htmlFor="theme">Component Theme</Label>
      <Select
        defaultValue={componentTheme}
        value={componentTheme}
        onValueChange={(value: ComponentThemeReact) => {
          // Radix bug:
          // https://github.com/radix-ui/primitives/issues/3135
          if (!value) {
            return;
          }

          setComponentTheme(value);
        }}
      >
        <SelectTrigger id="theme">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="base">Base</SelectItem>
          <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
          <SelectItem value="hacker">Hacker</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
