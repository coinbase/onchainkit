import { useBoolean } from 'usehooks-ts';

type ConnectModalState = {
  /** Boolean value indicating if the connect modal is open */
  isOpen: boolean;
  /** Function to set the connect modal state */
  setIsOpen: (isOpen: boolean) => void;
  /** Function to open the connect modal */
  openConnectModal: () => void;
  /** Function to close the connect modal */
  closeConnectModal: () => void;
  /** Function to toggle the connect modal */
  toggleConnectModal: () => void;
};

/**
 * Hook to manage the connect modal state
 * @returns an object containing the isOpen state and the openConnectModal and closeConnectModal functions
 */
export function useConnectModal(): ConnectModalState {
  const {
    value: isOpen,
    setValue: setIsOpen,
    setTrue: openConnectModal,
    setFalse: closeConnectModal,
    toggle: toggleConnectModal,
  } = useBoolean(false);

  return {
    isOpen,
    setIsOpen,
    openConnectModal,
    closeConnectModal,
    toggleConnectModal,
  };
}
