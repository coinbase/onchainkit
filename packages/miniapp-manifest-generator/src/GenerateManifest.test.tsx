import '@testing-library/jest-dom';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Create from './GenerateManifest';
import { SignProps } from './components/steps/Sign';

vi.mock('./components/Success', () => ({
  Success: () => <div>Success</div>,
}));

vi.mock('./components/steps/Connect', () => ({
  Connect: () => <div>Connect</div>,
}));

vi.mock('./components/steps/Domain', () => ({
  Domain: () => <div>Domain</div>,
}));

const mockManifest = {
  header: 'test-header',
  payload: 'test-payload',
  signature: 'test-signature',
  domain: 'https://example.com',
};

vi.mock('./components/steps/Sign', () => ({
  Sign: (props: SignProps) => (
    <button type="button" onClick={() => props.handleSigned(mockManifest)}>
      Sign
    </button>
  ),
}));

const mockWebSocket = {
  send: vi.fn(),
  close: vi.fn(),
  onclose: null as (() => void) | null,
  onerror: null as ((err: Event) => void) | null,
};

vi.mock('./hooks/useWebsocket', () => ({
  useWebsocket: () => mockWebSocket,
}));

describe('Create', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  it('should render', () => {
    render(<Create />);

    expect(screen.getByText('Connect')).toBeInTheDocument();
    expect(screen.getByText('Domain')).toBeInTheDocument();
    expect(screen.getByText('Sign')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('should handle account association and pass it to Success component', () => {
    const mockAccountAssociation = {
      header: 'test-header',
      payload: 'test-payload',
      signature: 'test-signature',
      domain: 'https://example.com',
    };

    render(<Create />);

    const signButton = screen.getByText('Sign');
    fireEvent.click(signButton);

    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify(mockAccountAssociation),
    );
  });
});
