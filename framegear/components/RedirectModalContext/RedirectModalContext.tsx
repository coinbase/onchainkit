import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RedirectModal } from '@/components/RedirectModal';

interface RedirectModalContextType {
  openModal: (onConfirm: () => void) => void;
  closeModal: () => void;
}

const RedirectModalContext = createContext<RedirectModalContextType | undefined>(undefined);

export const useRedirectModal = () => {
  const context = useContext(RedirectModalContext);
  if (context === undefined) {
    throw new Error('useRedirectModal must be used within a RedirectModalProvider');
  }
  return context;
};

export const RedirectModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);

  const openModal = (confirmAction: () => void) => {
    setOnConfirm(() => confirmAction);
  };

  const closeModal = () => {
    setOnConfirm(null);
  };

  return (
    <RedirectModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <RedirectModal
        isOpen={!!onConfirm}
        onClose={closeModal}
        onConfirm={() => {
          if (onConfirm) {
            onConfirm();
            closeModal();
          }
        }}
      />
    </RedirectModalContext.Provider>
  );
};
