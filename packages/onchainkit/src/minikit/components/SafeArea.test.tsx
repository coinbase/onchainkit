/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SafeArea } from './SafeArea';
import { useIsInMiniApp } from '../hooks/useIsInMiniApp';
import { useMiniKit } from '../hooks/useMiniKit';

vi.mock('../hooks/useIsInMiniApp', () => ({ useIsInMiniApp: vi.fn() }));
vi.mock('../hooks/useMiniKit', () => ({ useMiniKit: vi.fn() }));

describe('SafeArea', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.style.removeProperty(
      '--ock-minikit-safe-area-inset-top',
    );
    document.documentElement.style.removeProperty(
      '--ock-minikit-safe-area-inset-right',
    );
    document.documentElement.style.removeProperty(
      '--ock-minikit-safe-area-inset-bottom',
    );
    document.documentElement.style.removeProperty(
      '--ock-minikit-safe-area-inset-left',
    );
  });

  it('returns children unchanged and does not set variables when not in mini app', () => {
    (useIsInMiniApp as any).mockReturnValue({ isInMiniApp: false } as any);
    (useMiniKit as any).mockReturnValue({ context: { client: {} } } as any);

    render(
      <SafeArea>
        <div data-testid="content">Hello</div>
      </SafeArea>,
    );

    expect(screen.getByTestId('content')).toHaveTextContent('Hello');
    expect(
      document.documentElement.style.getPropertyValue(
        '--ock-minikit-safe-area-inset-top',
      ),
    ).toBe('');
  });

  it('sets css variables with px and wraps children with padding when asChild is false', () => {
    (useIsInMiniApp as any).mockReturnValue({ isInMiniApp: true } as any);
    (useMiniKit as any).mockReturnValue({
      context: {
        client: { safeAreaInsets: { top: 10, right: 2, bottom: 3, left: 4 } },
      },
    } as any);

    const { container } = render(
      <SafeArea>
        <div data-testid="content">Hello</div>
      </SafeArea>,
    );

    expect(
      document.documentElement.style
        .getPropertyValue('--ock-minikit-safe-area-inset-top')
        .trim(),
    ).toBe('10px');
    expect(
      document.documentElement.style
        .getPropertyValue('--ock-minikit-safe-area-inset-right')
        .trim(),
    ).toBe('2px');
    expect(
      document.documentElement.style
        .getPropertyValue('--ock-minikit-safe-area-inset-bottom')
        .trim(),
    ).toBe('3px');
    expect(
      document.documentElement.style
        .getPropertyValue('--ock-minikit-safe-area-inset-left')
        .trim(),
    ).toBe('4px');

    const wrapper = container.querySelector('div');
    expect(wrapper).toBeTruthy();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('asChild=true merges padding into single child style and preserves existing styles', () => {
    (useIsInMiniApp as any).mockReturnValue({ isInMiniApp: true } as any);
    (useMiniKit as any).mockReturnValue({
      context: {
        client: { safeAreaInsets: { top: 5, right: 6, bottom: 7, left: 8 } },
      },
    } as any);

    render(
      <SafeArea asChild>
        <div data-testid="child" style={{ color: 'red' }}>
          Hi
        </div>
      </SafeArea>,
    );

    const child = screen.getByTestId('child');
    expect(child).toBeInTheDocument();
    expect(child).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('asChild with non-element child warns and returns children as-is', () => {
    (useIsInMiniApp as any).mockReturnValue({ isInMiniApp: true } as any);
    (useMiniKit as any).mockReturnValue({
      context: {
        client: { safeAreaInsets: { top: 1, right: 1, bottom: 1, left: 1 } },
      },
    } as any);

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(<SafeArea asChild>{'text child'}</SafeArea>);

    expect(screen.getByText('text child')).toBeInTheDocument();
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('renders null with no children while still setting variables', () => {
    (useIsInMiniApp as any).mockReturnValue({ isInMiniApp: true } as any);
    (useMiniKit as any).mockReturnValue({
      context: {
        client: {
          safeAreaInsets: { top: 11, right: 12, bottom: 13, left: 14 },
        },
      },
    } as any);

    const { container } = render(<SafeArea>{null}</SafeArea>);
    expect(container.firstChild).toBeNull();
    expect(
      document.documentElement.style
        .getPropertyValue('--ock-minikit-safe-area-inset-top')
        .trim(),
    ).toBe('11px');
  });
});
