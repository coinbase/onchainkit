import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import { Toast } from './Toast';

describe('Toast component', () => {
  it('bottom-right renders correctly', () => {
    const setIsVisible = vi.fn();
    const { getByTestId } = render(
      <Toast
        isVisible={true}
        position="bottom-right"
        setIsVisible={setIsVisible}
      >
        <div>Test</div>
      </Toast>,
    );

    const toastContainer = getByTestId('ockToast');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('bottom-5 left-3/4');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  it('top-right renders correctly', () => {
    const setIsVisible = vi.fn();
    const { getByTestId } = render(
      <Toast
        isVisible={true}
        position="top-right"
        setIsVisible={setIsVisible}
      >
        <div>Test</div>
      </Toast>,
    );

    const toastContainer = getByTestId('ockToast');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('top-[100px] left-3/4');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  it('top-center renders correctly', () => {
    const setIsVisible = vi.fn();
    const { getByTestId } = render(
      <Toast
        isVisible={true}
        position="top-center"
        setIsVisible={setIsVisible}
      >
        <div>Test</div>
      </Toast>,
    );

    const toastContainer = getByTestId('ockToast');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('top-[100px] left-2/4');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  it('bottom-center renders correctly', () => {
    const setIsVisible = vi.fn();
    const { getByTestId } = render(
      <Toast
        isVisible={true}
        position="bottom-center"
        setIsVisible={setIsVisible}
      >
        <div>Test</div>
      </Toast>,
    );

    const toastContainer = getByTestId('ockToast');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('bottom-5 left-2/4');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  it('custom className is applied correctly', () => {
    const setIsVisible = vi.fn();
    const { getByTestId } = render(
      <Toast
        isVisible={true}
        position="bottom-right"
        setIsVisible={setIsVisible}
        className="custom-class"
      >
        <div>Test</div>
      </Toast>,
    );

    const toastContainer = getByTestId('ockToast');
    expect(toastContainer).toHaveClass('custom-class');
  });

  it('toast is not visible when isVisible is false', () => {
    const setIsVisible = vi.fn();
    const { queryByTestId } = render(
      <Toast
        isVisible={false}
        position="bottom-right"
        setIsVisible={setIsVisible}
      >
        <div>Test</div>
      </Toast>,
    );
    const toastContainer = queryByTestId('ockToast');
    expect(toastContainer).not.toBeInTheDocument();
  });

  it('toast close button works', () => {
    const setIsVisible = vi.fn();
    const { getByTestId } = render(
      <Toast
        isVisible={true}
        position="bottom-right"
        setIsVisible={setIsVisible}
      >
        <div>Test</div>
      </Toast>,
    );

    const closeButton = getByTestId('ockCloseButton');
    fireEvent.click(closeButton);
    expect(setIsVisible).toHaveBeenCalledWith(false);
  });

  it('toast renders children correctly', () => {
    const setIsVisible = vi.fn();
    const { getByText } = render(
      <Toast
        isVisible={true}
        position="bottom-right"
        setIsVisible={setIsVisible}
      >
        <div>Test</div>
      </Toast>,
    );

    const text = getByText('Test');
    expect(text).toBeInTheDocument();
  });

  it('toast disappears after durationMs', async () => {
    vi.useFakeTimers();
    const setIsVisible = vi.fn();
    const durationMs = 2000;

    render(
      <Toast
        isVisible={true}
        position="bottom-right"
        setIsVisible={setIsVisible}
        durationMs={durationMs}
      >
        <div>Test</div>
      </Toast>,
    );

    expect(setIsVisible).not.toHaveBeenCalled();

    vi.advanceTimersByTime(durationMs);

    expect(setIsVisible).toHaveBeenCalledWith(false);

    vi.useRealTimers();
  });

  it('timer does not fire after manual close', () => {
    vi.useFakeTimers();
    const setIsVisible = vi.fn();
    const durationMs = 2000;

    const { getByTestId, rerender } = render(
      <Toast
        isVisible={true}
        position="bottom-right"
        setIsVisible={setIsVisible}
        durationMs={durationMs}
      >
        <div>Test</div>
      </Toast>,
    );

    vi.advanceTimersByTime(1000);

    const closeButton = getByTestId('ockCloseButton');
    fireEvent.click(closeButton);

    expect(setIsVisible).toHaveBeenCalledTimes(1);
    expect(setIsVisible).toHaveBeenCalledWith(false);

    rerender(
      <Toast
        isVisible={false}
        position="bottom-right"
        setIsVisible={setIsVisible}
        durationMs={durationMs}
      >
        <div>Test</div>
      </Toast>,
    );

    vi.advanceTimersByTime(1500);
    expect(setIsVisible).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('cleanup happens correctly on unmount', () => {
    vi.useFakeTimers();
    const setIsVisible = vi.fn();

    const { unmount } = render(
      <Toast
        isVisible={true}
        position="bottom-right"
        setIsVisible={setIsVisible}
        durationMs={2000}
      >
        <div>Test</div>
      </Toast>,
    );

    unmount();
    vi.advanceTimersByTime(2000);

    expect(setIsVisible).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
