import {
  PopoverPortal as RadixPopoverPortal,
  Popover as RadixPopover,
  PopoverTrigger as RadixPopoverTrigger,
  PopoverContent as RadixPopoverContent,
  PopoverAnchor as RadixPopoverAnchor,
} from '@radix-ui/react-popover';
import { ComponentProps, ReactNode } from 'react';

type PopoverProps = {
  children?: React.ReactNode;
  /** Reference to the element that triggered the popover (e.g., a button that opened it). */
} & Pick<ComponentProps<typeof RadixPopover>, 'open' | 'onOpenChange'> &
  Pick<
    ComponentProps<typeof RadixPopoverContent>,
    'sideOffset' | 'side' | 'align'
  > &
  (
    | {
        /**
         * The element that will be used to trigger the popover.
         */
        trigger: ReactNode;
        anchor?: never;
      }
    | {
        trigger?: never;
        /**
         * The element that will be used to anchor the popover. you must render your own trigger component within
         */
        anchor: ReactNode;
      }
  );

export function Popover({
  children,
  trigger,
  open,
  onOpenChange,
  sideOffset,
  side,
  align,
  anchor,
}: PopoverProps) {
  return (
    <RadixPopover open={open} onOpenChange={onOpenChange}>
      {anchor && <RadixPopoverAnchor asChild>{anchor}</RadixPopoverAnchor>}
      {trigger && <RadixPopoverTrigger asChild>{trigger}</RadixPopoverTrigger>}
      <RadixPopoverPortal>
        <RadixPopoverContent sideOffset={sideOffset} side={side} align={align}>
          {children}
        </RadixPopoverContent>
      </RadixPopoverPortal>
    </RadixPopover>
  );
}
