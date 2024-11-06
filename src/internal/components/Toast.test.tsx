import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import { Toast } from './Toast';

describe('Toast component', () => {
  it('bottom-right renders correctly', () => {
    const setIsToastVisible = vi.fn();
    const { getByTestId } = render(
      <Toast
        isToastVisible={true}
        position="bottom-right"
        setIsToastVisible={setIsToastVisible}
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
    const setIsToastVisible = vi.fn();
    const { getByTestId } = render(
      <Toast
        isToastVisible={true}
        position="top-right"
        setIsToastVisible={setIsToastVisible}
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
    const setIsToastVisible = vi.fn();
    const { getByTestId } = render(
      <Toast
        isToastVisible={true}
        position="top-center"
        setIsToastVisible={setIsToastVisible}
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
    const setIsToastVisible = vi.fn();
    const { getByTestId } = render(
      <Toast
        isToastVisible={true}
        position="bottom-center"
        setIsToastVisible={setIsToastVisible}
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
    const setIsToastVisible = vi.fn();
    const { getByTestId } = render(
      <Toast
        isToastVisible={true}
        position="bottom-right"
        setIsToastVisible={setIsToastVisible}
        className="custom-class"
      >
        <div>Test</div>
      </Toast>,
    );

    const toastContainer = getByTestId('ockToast');
    expect(toastContainer).toHaveClass('custom-class');
  });

  it('toast is not visible when isToastVisible is false', () => {
    const setIsToastVisible = vi.fn();
    const { queryByTestId } = render(
      <Toast
        isToastVisible={false}
        position="bottom-right"
        setIsToastVisible={setIsToastVisible}
      >
        <div>Test</div>
      </Toast>,
    );
    const toastContainer = queryByTestId('ockToast');
    expect(toastContainer).not.toBeInTheDocument();
  });

  it('toast close button works', () => {
    const setIsToastVisible = vi.fn();
    const { getByTestId } = render(
      <Toast
        isToastVisible={true}
        position="bottom-right"
        setIsToastVisible={setIsToastVisible}
      >
        <div>Test</div>
      </Toast>,
    );

    const closeButton = getByTestId('ockCloseButton');
    fireEvent.click(closeButton);
    expect(setIsToastVisible).toHaveBeenCalledWith(false);
  });

  it('toast renders children correctly', () => {
    const setIsToastVisible = vi.fn();
    const { getByText } = render(
      <Toast
        isToastVisible={true}
        position="bottom-right"
        setIsToastVisible={setIsToastVisible}
      >
        <div>Test</div>
      </Toast>,
    );

    const text = getByText('Test');
    expect(text).toBeInTheDocument();
  });

  it('toast disappears after durationMs', async () => {
    vi.useFakeTimers();
    const setIsToastVisible = vi.fn();
    const durationMs = 2000;

    render(
      <Toast
        isToastVisible={true}
        position="bottom-right"
        setIsToastVisible={setIsToastVisible}
        durationMs={durationMs}
      >
        <div>Test</div>
      </Toast>,
    );

    expect(setIsToastVisible).not.toHaveBeenCalled();

    vi.advanceTimersByTime(durationMs);

    expect(setIsToastVisible).toHaveBeenCalledWith(false);

    vi.useRealTimers();
  });

  it('timer does not fire after manual close', () => {
    vi.useFakeTimers();
    const setIsToastVisible = vi.fn();
    const durationMs = 2000;

    const { getByTestId, rerender } = render(
      <Toast
        isToastVisible={true}
        position="bottom-right"
        setIsToastVisible={setIsToastVisible}
        durationMs={durationMs}
      >
        <div>Test</div>
      </Toast>,
    );

    vi.advanceTimersByTime(1000);

    const closeButton = getByTestId('ockCloseButton');
    fireEvent.click(closeButton);

    expect(setIsToastVisible).toHaveBeenCalledTimes(1);
    expect(setIsToastVisible).toHaveBeenCalledWith(false);

    rerender(
      <Toast
        isToastVisible={false}
        position="bottom-right"
        setIsToastVisible={setIsToastVisible}
        durationMs={durationMs}
      >
        <div>Test</div>
      </Toast>,
    );

    vi.advanceTimersByTime(1500);
    expect(setIsToastVisible).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('cleanup happens correctly on unmount', () => {
    vi.useFakeTimers();
    const setIsToastVisible = vi.fn();

    const { unmount } = render(
      <Toast
        isToastVisible={true}
        position="bottom-right"
        setIsToastVisible={setIsToastVisible}
        durationMs={2000}
      >
        <div>Test</div>
      </Toast>,
    );

    unmount();
    vi.advanceTimersByTime(2000);

    expect(setIsToastVisible).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
