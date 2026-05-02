import { useCallback, useEffect, useState } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { useOnchainKit } from '@/useOnchainKit';
import { useTransactionContext } from '../components/TransactionProvider';
import { simulateTransaction } from '../utils/simulateTransaction';
import type { SimulationResult } from '../utils/simulateTransaction';
import type { APIError } from '@/api/types';

export type UseTransactionSimulationParams = {
  enabled?: boolean; // default: true
};

export function useTransactionSimulation({
  enabled = true,
}: UseTransactionSimulationParams = {}) {
  const config = useConfig();
  const { address: from } = useAccount();
  const { chain } = useOnchainKit();
  const { calls } = useTransactionContext();
  
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const runSimulation = useCallback(async () => {
    if (!enabled || !from || !calls || calls.length === 0) {
      setSimulation(null);
      setError(null);
      return;
    }

    setIsSimulating(true);
    setError(null);

    // Simula solo la prima call per semplicità
    // (in produzione: simula tutte le calls in sequenza)
    const call = calls[0];
    if (!call.to) {
      setIsSimulating(false);
      return;
    }

    const result = await simulateTransaction({
      config,
      chainId: chain.id,
      from,
      to: call.to,
      data: call.data || '0x',
      value: call.value,
    });

    if ('code' in result) {
      setError(result as APIError);
      setSimulation(null);
    } else {
      setSimulation(result);
    }

    setIsSimulating(false);
  }, [enabled, from, calls, config, chain.id]);

  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  return {
    simulation,
    isSimulating,
    error,
    willFail: simulation ? !simulation.success : false,
    expectedOutput: simulation?.decodedOutput,
    gasEstimate: simulation?.gasUsed,
    warnings: simulation?.warnings ?? [],
    refresh: runSimulation,
  };
}
