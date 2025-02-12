import { useCallback, useState } from 'react';
import { parseEther, parseUnits } from 'viem';
import type { Chain, Hex } from 'viem';
import { useAccount, useConfig, useSwitchChain, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { ERC20ABI, OptimismPortalABI, StandardBridgeABI } from '../abi';
import { EXTRA_DATA, MIN_GAS_LIMIT } from '../constants';
import type { AppchainConfig } from '../types';
import type { BridgeParams } from '../types';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError';

interface DepositParams {
  config: AppchainConfig;
  from: Chain;
  bridgeParams: BridgeParams;
}

export function useDeposit() {
  const { writeContractAsync, data } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();
  const { chainId } = useAccount();
  const wagmiConfig = useConfig();
  const [status, setStatus] = useState<
    'depositPending' | 'depositSuccess' | 'error' | 'idle' | 'depositRejected'
  >('idle');

  const resetDepositStatus = useCallback(() => {
    setStatus('idle');
  }, []);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ignore
  const deposit = async ({ config, from, bridgeParams }: DepositParams) => {
    if (!bridgeParams.recipient) {
      throw new Error('Recipient is required');
    }

    if (chainId !== from.id) {
      await switchChainAsync({ chainId: from.id });
    }

    setStatus('depositPending');

    try {
      // Native ETH
      if (bridgeParams.token.address === '') {
        const txHash = await writeContractAsync({
          abi: StandardBridgeABI,
          functionName: 'bridgeETHTo',
          args: [bridgeParams.recipient, MIN_GAS_LIMIT, EXTRA_DATA],
          address: config.contracts.l1StandardBridge,
          value: parseEther(bridgeParams.amount),
          chainId: from.id,
        });

        await waitForTransactionReceipt(wagmiConfig, {
          hash: txHash,
          confirmations: 1,
          chainId: from.id,
        });
      } else {
        // ERC20
        if (!bridgeParams.token.remoteToken) {
          throw new Error('Remote token address is required for ERC-20 tokens');
        }

        const formattedAmount = parseUnits(
          bridgeParams.amount,
          bridgeParams.token.decimals,
        );

        // Bridge address is OptimismPortal for depositing custom gas tokens
        const bridgeAddress = bridgeParams.token.isCustomGasToken
          ? config.contracts.optimismPortal
          : config.contracts.l1StandardBridge;

        // Approve the L1StandardBridge to spend tokens
        const approveTx = await writeContractAsync({
          abi: ERC20ABI,
          functionName: 'approve',
          args: [bridgeAddress, formattedAmount],
          address: bridgeParams.token.address,
        });
        await waitForTransactionReceipt(wagmiConfig, {
          hash: approveTx,
          confirmations: 1,
          chainId: from.id,
        });

        let bridgeTxHash: Hex;

        // Bridge the tokens
        if (bridgeParams.token.isCustomGasToken) {
          bridgeTxHash = await writeContractAsync({
            abi: OptimismPortalABI,
            functionName: 'depositERC20Transaction',
            args: [
              bridgeParams.recipient,
              formattedAmount,
              BigInt(0),
              BigInt(MIN_GAS_LIMIT),
              false,
              EXTRA_DATA,
            ],
            address: bridgeAddress,
          });
        } else {
          bridgeTxHash = await writeContractAsync({
            abi: StandardBridgeABI,
            functionName: 'bridgeERC20To',
            args: [
              bridgeParams.token.address,
              bridgeParams.token.remoteToken, // TODO: manually calculate the salted address
              bridgeParams.recipient,
              formattedAmount,
              MIN_GAS_LIMIT,
              EXTRA_DATA,
            ],
            address: bridgeAddress,
          });
        }

        await waitForTransactionReceipt(wagmiConfig, {
          hash: bridgeTxHash,
          confirmations: 1,
          chainId: from.id,
        });
      }

      setStatus('depositSuccess');
    } catch (error) {
      if (isUserRejectedRequestError(error)) {
        console.error('User rejected request');
        setStatus('depositRejected');
      } else {
        setStatus('error');
      }
    }
  };

  return {
    deposit,
    depositStatus: status,
    transactionHash: data,
    resetDepositStatus,
  };
}
