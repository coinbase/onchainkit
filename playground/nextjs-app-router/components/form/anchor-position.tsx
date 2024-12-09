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

export function AnchorPosition() {
  const { anchorPosition, setAnchorPosition } = useContext(AppContext);

  return (
    <div className="grid gap-2">
      <Label htmlFor="anchor-position">Anchor Position</Label>
      <Select
        value={anchorPosition}
        onValueChange={setAnchorPosition}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select anchor position" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="top-left">Top Left</SelectItem>
          <SelectItem value="top-center">Top Center</SelectItem>
          <SelectItem value="top-right">Top Right</SelectItem>
          <SelectItem value="bottom-left">Bottom Left</SelectItem>
          <SelectItem value="bottom-center">Bottom Center</SelectItem>
          <SelectItem value="bottom-right">Bottom Right</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
