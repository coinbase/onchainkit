import { useState } from 'react';

type ConnectModalState = {
  /** Boolean value indicating if the connect modal is open */
  isOpen: boolean;
  /** Function to open the connect modal */
  openConnectModal: () => void;
  /** Function to close the connect modal */
  closeConnectModal: () => void;
};

/**
 * Hook to manage the connect modal state
 * @returns an object containing the isOpen state and the openConnectModal and closeConnectModal functions
 */
export function useConnectModal(): ConnectModalState {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    openConnectModal: () => setIsOpen(true),
    closeConnectModal: () => setIsOpen(false),
  };
}
