import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { useOnchainKit } from './useOnchainKit';
import { setOnchainKitConfig } from './OnchainKitConfig';
import { describe, it, expect } from 'vitest';

const TestComponent = () => {
  const { schemaId, apiKey } = useOnchainKit();
  return (
    <div>
      {apiKey} + {schemaId}
    </div>
  );
};

describe('useOnchainKit', () => {
  it('should return the correct value', () => {
    const schemaId = '0x123';
    const apiKey = 'test-api-key';
    setOnchainKitConfig({ schemaId, apiKey });
    const { container } = render(<TestComponent />, {
      wrapper: ({ children }) => <div>{children}</div>,
    });
    expect(container).toHaveTextContent(schemaId);
    expect(container).toHaveTextContent(apiKey);
  });
});
