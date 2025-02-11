import { useState } from 'react';
import { parseEther, parseUnits } from 'viem';
import type { Chain } from 'viem';
import { useAccount, useConfig, useSwitchChain, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { ERC20ABI, StandardBridgeABI } from '../abi';
import type { AppchainConfig } from '../types';
import type { BridgeParams } from '../types';

export function useDeposit() {
  const { writeContractAsync, data } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();
  const { chainId } = useAccount();
  const wagmiConfig = useConfig();
  const [status, setStatus] = useState<
    'pending' | 'success' | 'error' | 'idle'
  >('idle');

  const deposit = async ({
    config,
    from,
    bridgeParams,
  }: {
    config: AppchainConfig;
    from: Chain;
    bridgeParams: BridgeParams;
  }) => {
    if (!bridgeParams.recipient) {
      throw new Error('Recipient is required');
    }

    if (chainId !== from.id) {
      await switchChainAsync({ chainId: from.id });
    }

    const minGasLimit = 100000;
    const extraData = '0x';

    setStatus('pending');

    // Native ETH
    if (bridgeParams.token.address === '') {
      const txHash = await writeContractAsync({
        abi: StandardBridgeABI,
        functionName: 'bridgeETHTo',
        args: [bridgeParams.recipient, minGasLimit, extraData],
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
      // Approve the L1StandardBridge to spend tokens
      const approveTx = await writeContractAsync({
        abi: ERC20ABI,
        functionName: 'approve',
        args: [config.contracts.l1StandardBridge, formattedAmount],
        address: bridgeParams.token.address,
      });
      await waitForTransactionReceipt(wagmiConfig, {
        hash: approveTx,
        confirmations: 1,
        chainId: from.id,
      });

      // Bridge the tokens
      const bridgeTx = await writeContractAsync({
        abi: StandardBridgeABI,
        functionName: 'bridgeERC20To',
        args: [
          bridgeParams.token.address,
          bridgeParams.token.remoteToken, // TODO: manually calculate the salted address
          bridgeParams.recipient,
          formattedAmount,
          minGasLimit,
          extraData,
        ],
        address: config.contracts.l1StandardBridge,
      });

      await waitForTransactionReceipt(wagmiConfig, {
        hash: bridgeTx,
        confirmations: 1,
        chainId: from.id,
      });
    }

    setStatus('success');
  };

  return {
    deposit,
    depositStatus: status,
    transactionHash: data,
  };
}
