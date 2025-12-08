import { zIndex } from '@/styles/constants';
import { cn } from '@/styles/theme';
import type React from 'react';
import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import { ComponentProps, ReactNode } from 'react';
import { useLayerConfigContext } from './LayerConfigProvider';

const DropdownMenuRoot = DropdownMenuPrimitives.Root;
const DropdownMenuTrigger = DropdownMenuPrimitives.Trigger;
const DropdownMenuContent = DropdownMenuPrimitives.Content;
export const DropdownMenuItem = DropdownMenuPrimitives.Item;

type DropdownMenuProps = {
  /** Content of the dropdown menu */
  children: React.ReactNode;
  isOpen?: boolean;
  /** Callback for when the dropdown should close */
  onClose?: () => void;
  /** The element that triggers the dropdown menu */
  trigger: ReactNode;
  'aria-label'?: string;
  className?: string;
} & ComponentProps<typeof DropdownMenuPrimitives.Content>;

export const DropdownMenu = ({
  isOpen,
  onClose,
  trigger,
  sideOffset = 8,
  side = 'bottom',
  children,
  align = 'start',
  'aria-label': ariaLabel,
  className,
}: DropdownMenuProps) => {
  const { forceDropdownModal } = useLayerConfigContext();

  return (
    <DropdownMenuRoot
      open={isOpen}
      onOpenChange={(flag) => {
        if (!flag) {
          onClose?.();
        }
      }}
      modal={forceDropdownModal}
    >
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={sideOffset}
        side={side}
        aria-label={ariaLabel}
        align={align}
        className={cn(zIndex.dropdown, className)}
        data-testid="ockDropdownMenu"
        role="listbox"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
};
