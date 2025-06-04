'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/styles/theme';
import { useTheme } from '../hooks/useTheme';
import { zIndex } from '@/styles/constants';

const SheetRoot = SheetPrimitive.Root;
const SheetPortal = SheetPrimitive.Portal;
const SheetTitle = SheetPrimitive.Title;
const SheetDescription = SheetPrimitive.Description;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      zIndex.modal,
      'fixed inset-0 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
    data-testid="ockSheetOverlay"
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

type SheetProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Title of the sheet, used for a11y purposes */
  title: string;
  /** Description of the sheet, used for a11y purposes */
  description: string;
} & React.ComponentProps<typeof SheetPrimitive.Content>;

export const Sheet = ({
  children,
  className,
  isOpen,
  onClose,
  side = 'right',
  title,
  description,
  ...rest
}: SheetProps) => {
  const componentTheme = useTheme();

  const sheetContentClassName = cn(
    componentTheme,
    zIndex.modal,
    'bg-ock-bg-default',
    'fixed gap-4 p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
    side === 'top' &&
      'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top rounded-b-3xl',
    side === 'bottom' &&
      'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom rounded-t-3xl',
    side === 'left' &&
      'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
    side === 'right' &&
      'inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
    className,
  );

  return (
    <SheetRoot
      open={isOpen}
      onOpenChange={(flag) => {
        if (!flag) {
          onClose();
        }
      }}
    >
      <SheetPortal>
        <SheetOverlay />
        <SheetTitle className="sr-only">{title}</SheetTitle>
        <SheetDescription className="sr-only">{description}</SheetDescription>
        <SheetPrimitive.Content
          className={sheetContentClassName}
          {...rest}
          data-testid="ockSheet"
        >
          {children}
        </SheetPrimitive.Content>
      </SheetPortal>
    </SheetRoot>
  );
};
