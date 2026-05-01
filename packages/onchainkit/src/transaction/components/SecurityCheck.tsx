'use client';

import { useCallback, useEffect, useState } from 'react';
import { type Address } from 'viem';
import { useTransactionContext } from './TransactionProvider';
import { cn, text, border, pressable } from '@/styles/theme';

type SecurityStatus = {
  label: string;
  status: 'safe' | 'warning' | 'danger';
  detail?: string;
};

type ContractVerificationData = {
  isVerified: boolean;
  isProxy: boolean;
  proxyTarget: string | null;
  risk: 'low' | 'medium' | 'high';
  warnings: string[];
};

const BASESCAN_API_URL = 'https://api.basescan.org/api';

async function fetchContractVerification(address: string): Promise<ContractVerificationData | null> {
  try {
    const params = new URLSearchParams({
      module: 'contract',
      action: 'getsourcecode',
      address,
    });
    const res = await fetch(`${BASESCAN_API_URL}?${params}`);
    const data = await res.json();
    
    if (data.status !== '1' || !data.result?.[0]) return null;
    
    const info = data.result[0];
    const isVerified = info.ABI !== 'Contract source code not verified';
    const isProxy = info.Proxy === '1';
    
    const warnings: string[] = [];
    let risk: 'low' | 'medium' | 'high' = 'low';
    
    if (!isVerified) {
      risk = 'high';
      warnings.push('Contract not verified');
    }
    if (isProxy && !info.Implementation) {
      risk = 'high';
      warnings.push('Proxy without implementation');
    }
    
    return {
      isVerified,
      isProxy,
      proxyTarget: isProxy ? info.Implementation : null,
      risk,
      warnings,
    };
  } catch {
    return null;
  }
}

export function SecurityCheck({ className }: { className?: string }) {
  const { calls } = useTransactionContext();
  const [checks, setChecks] = useState<SecurityStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runChecks = useCallback(async () => {
    if (!calls || calls.length === 0) {
      setChecks([]);
      return;
    }

    setIsLoading(true);
    const results: SecurityStatus[] = [];

    // Extract contract addresses from calls
    const addresses = calls
      .map((call) => call.to)
      .filter((addr): addr is Address => !!addr);

    // Remove duplicates
    const uniqueAddresses = [...new Set(addresses)];

    for (const address of uniqueAddresses) {
      const verification = await fetchContractVerification(address);
      
      if (!verification) {
        results.push({
          label: 'Contract check failed',
          status: 'warning',
          detail: `Could not verify ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
        continue;
      }

      if (verification.isVerified) {
        results.push({
          label: 'Contract verified',
          status: 'safe',
          detail: `${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      } else {
        results.push({
          label: 'Contract not verified',
          status: 'danger',
          detail: `${address.slice(0, 6)}...${address.slice(-4)} — ${verification.warnings[0]}`,
        });
      }

      if (verification.isProxy) {
        results.push({
          label: 'Proxy contract',
          status: verification.proxyTarget ? 'warning' : 'danger',
          detail: verification.proxyTarget 
            ? `Implementation: ${verification.proxyTarget.slice(0, 6)}...${verification.proxyTarget.slice(-4)}`
            : 'Implementation unknown',
        });
      }
    }

    setChecks(results);
    setIsLoading(false);
  }, [calls]);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-2 py-2', className)} data-testid="ock-security-check-loading">
        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        <span className={cn(text.label2)}>Checking contract security...</span>
      </div>
    );
  }

  if (checks.length === 0) return null;

  return (
    <div className={cn('flex flex-col gap-2 py-2', className)} data-testid="ock-security-check">
      {checks.map((check, i) => (
        <div
          key={i}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md',
            check.status === 'safe' && 'bg-green-50 text-green-700',
            check.status === 'warning' && 'bg-yellow-50 text-yellow-700',
            check.status === 'danger' && 'bg-red-50 text-red-700',
          )}
        >
          <span className="text-lg">
            {check.status === 'safe' && '✅'}
            {check.status === 'warning' && '⚠️'}
            {check.status === 'danger' && '🔴'}
          </span>
          <div className="flex flex-col">
            <span className={cn(text.label2, 'font-medium')}>{check.label}</span>
            {check.detail && (
              <span className={cn(text.body, 'opacity-75')}>{check.detail}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
