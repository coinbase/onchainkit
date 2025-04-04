import { getChainExplorer } from '@/core/network/getChainExplorer';
import type { Address, Chain, TransactionReceipt } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultSendTxSuccessHandler } from './defaultSendTxSuccessHandler';

vi.mock('@/core/network/getChainExplorer');
vi.mock('wagmi', () => ({
  useChainId: () => 8453,
}));

describe('defaultSendTxSuccessHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'open').mockImplementation(() => null);
    vi.mocked(getChainExplorer).mockReturnValue('https://basescan.org');
  });

  it('opens Coinbase Wallet URL when all SW params are present', () => {
    const handler = defaultSendTxSuccessHandler({
      transactionId: 'txn123',
      transactionHash: '0xabc',
      senderChain: { id: 1, name: 'Ethereum' } as Chain,
      address: '0x123' as Address,
      onComplete: vi.fn(),
    });

    handler({} as TransactionReceipt);

    const [[url]] = vi.mocked(window.open).mock.calls;
    expect(url?.toString()).toBe(
      'https://wallet.coinbase.com/assets/transactions?contentParams%5BtxHash%5D=0xabc&contentParams%5BchainId%5D=1&contentParams%5BfromAddress%5D=0x123',
    );
    expect(window.open).toHaveBeenCalledWith(
      expect.any(URL),
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('opens block explorer when SW params are missing', () => {
    const handler = defaultSendTxSuccessHandler({
      transactionId: undefined,
      transactionHash: '0xabc',
      senderChain: undefined,
      address: undefined,
    });

    handler({} as TransactionReceipt);

    const [[url]] = vi.mocked(window.open).mock.calls;
    expect(url?.toString()).toBe('https://basescan.org/tx/0xabc');
    expect(window.open).toHaveBeenCalledWith(
      'https://basescan.org/tx/0xabc',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('calls onComplete callback if provided', () => {
    const onComplete = vi.fn();
    const handler = defaultSendTxSuccessHandler({
      transactionId: undefined,
      transactionHash: '0xabc',
      senderChain: undefined,
      address: undefined,
      onComplete,
    });

    handler({} as TransactionReceipt);

    expect(onComplete).toHaveBeenCalled();
  });

  it('uses senderChain.id when available', () => {
    const handler = defaultSendTxSuccessHandler({
      transactionId: undefined,
      transactionHash: '0xabc',
      senderChain: { id: 1, name: 'Ethereum' } as Chain,
      address: undefined,
    });

    vi.mocked(getChainExplorer).mockReturnValue('https://basescan.org');

    handler({} as TransactionReceipt);

    expect(getChainExplorer).toHaveBeenCalledWith(1);
  });

  it('falls back to useChainId when senderChain is undefined', () => {
    const handler = defaultSendTxSuccessHandler({
      transactionId: undefined,
      transactionHash: '0xabc',
      senderChain: undefined,
      address: undefined,
    });

    handler({} as TransactionReceipt);

    expect(getChainExplorer).toHaveBeenCalledWith(8453);
  });
});
