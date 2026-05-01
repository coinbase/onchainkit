import { render, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { SecurityCheck } from './SecurityCheck';
import { useTransactionContext } from './TransactionProvider';

vi.mock('./TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

describe('SecurityCheck', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn();
  });

  it('should show loading state when checking', () => {
    (useTransactionContext as Mock).mockReturnValue({
      calls: [{ to: '0x1234567890123456789012345678901234567890' }],
    });

    const mockFetch = vi.fn(() => new Promise(() => {})); // never resolves
    global.fetch = mockFetch;

    const { getByTestId } = render(<SecurityCheck />);
    expect(getByTestId('ock-security-check-loading')).toBeInTheDocument();
  });

  it('should show verified contract as safe', async () => {
    (useTransactionContext as Mock).mockReturnValue({
      calls: [{ to: '0x1234567890123456789012345678901234567890' }],
    });

    const mockFetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          status: '1',
          message: 'OK',
          result: [{
            ABI: '[{"type":"function"}]',
            SourceCode: 'pragma solidity ^0.8.0;',
            ContractName: 'MyToken',
            Proxy: '0',
            Implementation: '',
          }],
        }),
      })
    );
    global.fetch = mockFetch;

    const { getByText } = render(<SecurityCheck />);

    await waitFor(() => expect(getByText('Contract verified')).toBeInTheDocument());
  });

  it('should show unverified contract as danger', async () => {
    (useTransactionContext as Mock).mockReturnValue({
      calls: [{ to: '0x1234567890123456789012345678901234567890' }],
    });

    const mockFetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          status: '1',
          message: 'OK',
          result: [{
            ABI: 'Contract source code not verified',
            SourceCode: '',
            ContractName: '',
            Proxy: '0',
            Implementation: '',
          }],
        }),
      })
    );
    global.fetch = mockFetch;

    const { getByText } = render(<SecurityCheck />);

    await waitFor(() => expect(getByText('Contract not verified')).toBeInTheDocument());
  });

  it('should show proxy contract warning', async () => {
    (useTransactionContext as Mock).mockReturnValue({
      calls: [{ to: '0x1234567890123456789012345678901234567890' }],
    });

    const mockFetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          status: '1',
          message: 'OK',
          result: [{
            ABI: '[{"type":"function"}]',
            SourceCode: 'pragma solidity ^0.8.0;',
            ContractName: 'Proxy',
            Proxy: '1',
            Implementation: '0x9999999999999999999999999999999999999999',
          }],
        }),
      })
    );
    global.fetch = mockFetch;

    const { getByText } = render(<SecurityCheck />);

    await waitFor(() => expect(getByText('Proxy contract')).toBeInTheDocument());
  });

  it('should return null when no calls', () => {
    (useTransactionContext as Mock).mockReturnValue({
      calls: [],
    });

    const { container } = render(<SecurityCheck />);
    expect(container.firstChild).toBeNull();
  });
});
