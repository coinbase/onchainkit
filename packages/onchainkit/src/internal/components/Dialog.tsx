import * as DialogPrimitives from '@radix-ui/react-dialog';
import { useTheme } from '@/internal/hooks/useTheme';
import { zIndex } from '@/styles/constants';
import { cn } from '@/styles/theme';
import type React from 'react';
import { ComponentProps } from 'react';

const DialogRoot = DialogPrimitives.Root;
const DialogPortal = DialogPrimitives.Portal;
const DialogTitle = DialogPrimitives.Title;
const DialogDescription = DialogPrimitives.Description;
const DialogContent = DialogPrimitives.Content;
const DialogOverlay = DialogPrimitives.Overlay;

type DialogProps = {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  /**
   * The title of the dialog.
   */
  title: string;
  /**
   * The description of the dialog.
   */
  description: string;
} & ComponentProps<typeof DialogPrimitives.DialogContent>;

export const Dialog = ({
  children,
  isOpen,
  onClose,
  className,
  title,
  description,
  ...rest
}: DialogProps) => {
  const componentTheme = useTheme();

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(flag) => {
        if (!flag) {
          onClose();
        }
      }}
    >
      <DialogTitle className="sr-only">{title}</DialogTitle>
      <DialogDescription className="sr-only">{description}</DialogDescription>
      <DialogPortal data-slot="dialog-portal">
        <DialogOverlay
          data-slot="dialog-overlay"
          className={cn(
            zIndex.modal,
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 bg-black/50',
          )}
        />
        <DialogContent
          data-slot="dialog-content"
          className={cn(
            componentTheme,
            zIndex.modal,
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg p-6 shadow-lg duration-200',
            className,
          )}
          data-testid="ockDialog"
          {...rest}
        >
          {children}
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
};
