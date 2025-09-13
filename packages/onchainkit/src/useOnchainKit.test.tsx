import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { setOnchainKitConfig } from './core/OnchainKitConfig';
import { useOnchainKit } from './useOnchainKit';

const TestComponent = () => {
  const { apiKey } = useOnchainKit();
  return (
    <div>
      {apiKey}
    </div>
  );
};

describe('useOnchainKit', () => {
  it('should return the correct value', () => {
    const apiKey = 'test-api-key';
    setOnchainKitConfig({ apiKey });
    const { container } = render(<TestComponent />, {
      wrapper: ({ children }) => <div>{children}</div>,
    });
    expect(container).toHaveTextContent(apiKey);
  });
});
