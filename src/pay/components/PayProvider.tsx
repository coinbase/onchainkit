import { useContext, createContext, useCallback } from 'react';
import { useValue } from '../../internal/hooks/useValue';
import { buildPayTransaction } from '../../api';
import { useAccount } from 'wagmi';

type PayContextType = {
  chainId: number;
  handleSubmit: () => void;
};

const emptyContext = {} as PayContextType;
export const PayContext = createContext<PayContextType>(emptyContext);

export function PayProvider({
  chainId,
  chargeId,
  children,
  className,
}: {
  chainId: number;
  chargeId: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { address } = useAccount();

  const handleSubmit = useCallback(async () => {
    if (!address) return;
    const response = await buildPayTransaction({
      address,
      chainId,
      chargeId,
    });
    console.log(response);
  }, [address, chainId]);

  const value = useValue({
    chainId,
    handleSubmit,
  });
  return <PayContext.Provider value={value}>{children}</PayContext.Provider>;
}

export function usePayContext() {
  const context = useContext(PayContext);
  if (context === emptyContext) {
    throw new Error('usePayContext must be used within a Swap component');
  }
  return context;
}
