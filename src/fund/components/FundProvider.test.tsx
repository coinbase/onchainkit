import { render, screen } from '@testing-library/react';
import { FundCardProvider, useFundContext } from './FundCardProvider';
import { describe, expect, it } from 'vitest';
import { act } from 'react';

const TestComponent = () => {
  const context = useFundContext();
  return (
    <div>
      <span data-testid="selected-asset">{context.selectedAsset}</span>
    </div>
  );
};

describe('FundCardProvider', () => {
  it('provides default context values', () => {
    render(
      <FundCardProvider asset="BTC">
        <TestComponent />
      </FundCardProvider>
    );
    expect(screen.getByTestId('selected-asset').textContent).toBe('BTC');
  });

  it('updates selectedAsset when setSelectedAsset is called', () => {
    const TestUpdateComponent = () => {
      const { selectedAsset, setSelectedAsset } = useFundContext();
      return (
        <div>
          <span data-testid="selected-asset">{selectedAsset}</span>
          <button type='button' onClick={() => setSelectedAsset('ETH')}>Change Asset</button>
        </div>
      );
    };

    render(
      <FundCardProvider asset="BTC">
        <TestUpdateComponent />
      </FundCardProvider>
    );
    
    expect(screen.getByTestId('selected-asset').textContent).toBe('BTC');
    act(() => {
        screen.getByText('Change Asset').click();
    });
    expect(screen.getByTestId('selected-asset').textContent).toBe('ETH');
  });

  it('throws error when useFundContext is used outside of FundCardProvider', () => {
    const TestOutsideProvider = () => {
      useFundContext();
      return <div>Test</div>;
    };

    expect(() => render(<TestOutsideProvider />)).toThrow(
      'useFundContext must be used within a FundCardProvider'
    );
  });
});
