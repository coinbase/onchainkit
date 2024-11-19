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
import type { ComponentTheme as ComponentThemeType } from '@/types/onchainkit';

export function ComponentTheme() {
  const { componentTheme, setComponentTheme } = useContext(AppContext);
  console.log('componentTheme ():', componentTheme);

  return (
    <div className="grid gap-2">
      <Label htmlFor="theme">Component Theme</Label>
      <Select
        value={componentTheme}
        onValueChange={(value: ComponentThemeType) => {
          console.log('onValueChange raw value:', value);
          console.log('onValueChange typeof value:', typeof value);
          console.log('current componentTheme:', componentTheme);
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
