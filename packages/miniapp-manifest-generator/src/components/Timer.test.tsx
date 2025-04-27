import '@testing-library/jest-dom';
import { act } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timer } from './Timer';

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render', () => {
    render(<Timer startMs={5000} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should count down every second', () => {
    render(<Timer startMs={5000} />);

    expect(screen.getByText('5')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('4')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should use custom interval', () => {
    render(<Timer startMs={5000} interval={2000} />);

    expect(screen.getByText('5')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('3')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should support custom format function', () => {
    const formatFunc = (timeMs: number) => `${(timeMs / 1000).toFixed(1)}s`;

    render(<Timer startMs={5000} formatFunc={formatFunc} />);

    expect(screen.getByText('5.0s')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('4.0s')).toBeInTheDocument();
  });

  it('should call callback when timer reaches zero', () => {
    const callback = vi.fn();
    render(<Timer startMs={2000} callback={callback} />);

    expect(screen.getByText('2')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(callback).toHaveBeenCalled();
  });

  it('should stop at zero', () => {
    render(<Timer startMs={2000} />);

    expect(screen.getByText('2')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('0')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should clean up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    const { unmount } = render(<Timer startMs={5000} />);

    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
