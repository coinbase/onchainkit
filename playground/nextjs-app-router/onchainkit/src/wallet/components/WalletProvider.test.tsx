import '@testing-library/jest-dom';
import { render, renderHook } from '@testing-library/react';
import { WalletProvider, useWalletContext } from './WalletProvider';

describe('useWalletContext', () => {
  it('should return default context', () => {
    render(
      <WalletProvider>
        <div />
      </WalletProvider>,
    );

    const { result } = renderHook(() => useWalletContext(), {
      wrapper: WalletProvider,
    });
    expect(result.current.isOpen).toEqual(false);
  });
});
