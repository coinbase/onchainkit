import '@testing-library/jest-dom';
import { act } from 'react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from './Page';
import { SignProps } from './steps/Sign';

vi.mock('./Success', () => ({
  Success: () => <div>Success</div>,
}));

vi.mock('./steps/Connect', () => ({
  Connect: () => <div>Connect</div>,
}));

vi.mock('./steps/Domain', () => ({
  Domain: () => <div>Domain</div>,
}));

const mockManifest = {
  header: 'test-header',
  payload: 'test-payload',
  signature: 'test-signature',
  domain: 'https://example.com',
};

vi.mock('./steps/Sign', () => ({
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

const WebSocketMock = vi.fn(() => mockWebSocket);

vi.stubGlobal('WebSocket', WebSocketMock);

describe('Page', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  it('should render', () => {
    render(<Page />);

    expect(screen.getByText('Connect')).toBeInTheDocument();
    expect(screen.getByText('Domain')).toBeInTheDocument();
    expect(screen.getByText('Sign')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('should initialize WebSocket connection', () => {
    render(<Page />);

    expect(WebSocketMock).toHaveBeenCalledWith('ws://localhost:3333');
  });

  it('should reconnect on WebSocket close', () => {
    render(<Page />);

    mockWebSocket.onclose?.();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(WebSocketMock).toHaveBeenCalledTimes(2);
  });

  it('should stop reconnecting after max attempts', () => {
    render(<Page />);

    for (let i = 0; i < 6; i++) {
      mockWebSocket.onclose?.();

      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }
    expect(WebSocketMock).toHaveBeenCalledTimes(6);
  });

  it('should handle WebSocket errors', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<Page />);

    mockWebSocket.onerror?.(new Event('error'));

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should clean up WebSocket on unmount', () => {
    const { unmount } = render(<Page />);

    unmount();

    expect(mockWebSocket.close).toHaveBeenCalled();
  });

  it('should handle account association and pass it to Success component', () => {
    const mockAccountAssociation = {
      header: 'test-header',
      payload: 'test-payload',
      signature: 'test-signature',
      domain: 'https://example.com',
    };

    render(<Page />);

    const signButton = screen.getByText('Sign');
    fireEvent.click(signButton);

    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify(mockAccountAssociation),
    );
  });

  it('should handle modal mutation observer', async () => {
    const { container } = render(<Page />);

    const modal = document.createElement('div');
    modal.setAttribute('data-testid', 'ockModalOverlay');
    modal.innerHTML = `
      <div>
        <div class="flex w-full flex-col gap-3">
          <button>Sign Up</button>
          <div class="relative">Or Continue</div>
        </div>
      </div>
    `;

    container.appendChild(modal);

    const signUpButton = modal.querySelector('button') as HTMLElement;
    const orContinueDiv = modal.querySelector('.relative') as HTMLElement;

    await act(async () => {
      // let mutation observer run
      vi.advanceTimersByTime(1);
    });

    expect(signUpButton?.style.display).toBe('none');
    expect(orContinueDiv?.style.display).toBe('none');
  });
});
