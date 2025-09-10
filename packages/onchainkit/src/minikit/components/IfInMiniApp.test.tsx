import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getOnchainKitConfig } from '@/core/OnchainKitConfig';
import { useIsInMiniApp } from '../hooks/useIsInMiniApp';
import { IfInMiniApp } from './IfInMiniApp';

vi.mock('@/core/OnchainKitConfig', () => ({
  getOnchainKitConfig: vi.fn(),
}));

vi.mock('../hooks/useIsInMiniApp', () => ({
  useIsInMiniApp: vi.fn(),
}));

describe('IfInMiniApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when in mini app and enabled', () => {
    (getOnchainKitConfig as any).mockReturnValue({ enabled: true });
    (useIsInMiniApp as any).mockReturnValue({ isInMiniApp: true });

    render(
      <IfInMiniApp>
        <div data-testid="miniapp-content">MiniApp Content</div>
      </IfInMiniApp>
    );

    expect(screen.getByTestId('miniapp-content')).toBeInTheDocument();
  });

  it('renders fallback when not in mini app', () => {
    (getOnchainKitConfig as any).mockReturnValue({ enabled: true });
    (useIsInMiniApp as any).mockReturnValue({ isInMiniApp: false });

    render(
      <IfInMiniApp fallback={<div data-testid="fallback">Fallback Content</div>}>
        <div data-testid="miniapp-content">MiniApp Content</div>
      </IfInMiniApp>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('miniapp-content')).not.toBeInTheDocument();
  });

  it('renders fallback when minikit is not enabled', () => {
    (getOnchainKitConfig as any).mockReturnValue({ enabled: false });
    (useIsInMiniApp as any).mockReturnValue({ isInMiniApp: true });

    render(
      <IfInMiniApp fallback={<div data-testid="fallback">Fallback Content</div>}>
        <div data-testid="miniapp-content">MiniApp Content</div>
      </IfInMiniApp>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('miniapp-content')).not.toBeInTheDocument();
  });

  it('renders fallback when minikit config is null', () => {
    (getOnchainKitConfig as any).mockReturnValue(null);
    (useIsInMiniApp as any).mockReturnValue({ isInMiniApp: true });

    render(
      <IfInMiniApp fallback={<div data-testid="fallback">Fallback Content</div>}>
        <div data-testid="miniapp-content">MiniApp Content</div>
      </IfInMiniApp>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('miniapp-content')).not.toBeInTheDocument();
  });

  it('renders null when no fallback provided and conditions not met', () => {
    (getOnchainKitConfig as any).mockReturnValue({ enabled: false });
    (useIsInMiniApp as any).mockReturnValue({ isInMiniApp: false });

    const { container } = render(
      <IfInMiniApp>
        <div data-testid="miniapp-content">MiniApp Content</div>
      </IfInMiniApp>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders null when no fallback provided and not in miniapp', () => {
    (getOnchainKitConfig as any).mockReturnValue({ enabled: true });
    (useIsInMiniApp as any).mockReturnValue({ isInMiniApp: false });

    const { container } = render(
      <IfInMiniApp>
        <div data-testid="miniapp-content">MiniApp Content</div>
      </IfInMiniApp>
    );

    expect(container.firstChild).toBeNull();
  });
});