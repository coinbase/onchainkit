import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ComponentMode as ComponentModeReact } from '@/types/onchainkit';
import { useContext } from 'react';
import { AppContext } from '../AppProvider';

export function ComponentMode() {
  const { componentMode, setComponentMode } = useContext(AppContext);

  return (
    <div className="grid gap-2">
      <Label htmlFor="mode">Component Mode</Label>
      <Select
        value={componentMode}
        onValueChange={(value: ComponentModeReact) => {
          // Radix bug:
          // https://github.com/radix-ui/primitives/issues/3135
          if (!value) {
            return;
          }

          return setComponentMode(value);
        }}
      >
        <SelectTrigger id="mode">
          <SelectValue placeholder="Select mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">Auto</SelectItem>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
