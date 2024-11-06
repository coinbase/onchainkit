import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, test, vi } from 'vitest';
import { Toast } from './Toast';

describe('Toast component', () => {
  test('bottom-right renders correctly', () => {
    const { getByTestId } = render(
      <Toast
        isToastVisible={true}
        position="bottom-right"
        setIsToastVisible={() => {}}
      >
        <div>Test</div>
      </Toast>
    );

    const toastContainer = getByTestId('ockToast');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('bottom-5 left-3/4');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  test('top-right renders correctly', () => {
    const { getByTestId } = render(
      <Toast
        isToastVisible={true}
        position="top-right"
        setIsToastVisible={() => {}}
      >
        <div>Test</div>
      </Toast>
    );

    const toastContainer = getByTestId('ockToast');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('top-[100px] left-3/4');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  test('top-center renders correctly', () => {
    const { getByTestId } = render(
      <Toast
        isToastVisible={true}
        position="top-center"
        setIsToastVisible={() => {}}
      >
        <div>Test</div>
      </Toast>
    );

    const toastContainer = getByTestId('ockToast');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('top-[100px] left-2/4');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  test('bottom-center renders correctly', () => {
    const { getByTestId } = render(
      <Toast
        isToastVisible={true}
        position="bottom-center"
        setIsToastVisible={() => {}}
      >
        <div>Test</div>
      </Toast>
    );

    const toastContainer = getByTestId('ockToast');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('bottom-5 left-2/4');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  test('custom className is applied correctly', () => {
    const { getByTestId } = render(
      <Toast
        isToastVisible={true}
        position="bottom-right"
        setIsToastVisible={() => {}}
        className="custom-class"
      >
        <div>Test</div>
      </Toast>
    );

    const toastContainer = getByTestId('ockToast');
    expect(toastContainer).toHaveClass('custom-class');
  });

  test('toast is not visible when isToastVisible is false', () => {
    const { queryByTestId } = render(
      <Toast
        isToastVisible={false}
        position="bottom-right"
        setIsToastVisible={() => {}}
      >
        <div>Test</div>
      </Toast>
    );
    const toastContainer = queryByTestId('ockToast');
    expect(toastContainer).not.toBeInTheDocument();
  });

  test('toast close button works', () => {
    const setIsToastVisible = vi.fn();
    const { getByTestId } = render(
      <Toast
        isToastVisible={true}
        position="bottom-right"
        setIsToastVisible={setIsToastVisible}
      >
        <div>Test</div>
      </Toast>
    );

    const closeButton = getByTestId('ockCloseButton');
    fireEvent.click(closeButton);
    expect(setIsToastVisible).toHaveBeenCalledWith(false);
  });

  test('toast renders children correctly', () => {
    const { getByText } = render(
      <Toast
        isToastVisible={true}
        position="bottom-right"
        setIsToastVisible={() => {}}
      >
        <div>Test</div>
      </Toast>
    );

    const text = getByText('Test');
    expect(text).toBeInTheDocument();
  });

  test('toast disappears after durationMs', async () => {
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
      </Toast>
    );

    expect(setIsToastVisible).not.toHaveBeenCalled();

    // Fast-forward time by durationMs
    vi.advanceTimersByTime(durationMs);

    expect(setIsToastVisible).toHaveBeenCalledWith(false);

    vi.useRealTimers();
  });

  test('timer does not fire after manual close', () => {
    vi.useFakeTimers();
    const setIsToastVisible = vi.fn();
    const durationMs = 2000;

    const { getByTestId } = render(
      <Toast
        isToastVisible={true}
        position="bottom-right"
        setIsToastVisible={setIsToastVisible}
        durationMs={durationMs}
      >
        <div>Test</div>
      </Toast>
    );

    // Advance partway through the duration
    vi.advanceTimersByTime(1000);

    // Simulate clicking the close button
    const closeButton = getByTestId('ockCloseButton');
    fireEvent.click(closeButton);

    // First call is from the close button
    expect(setIsToastVisible).toHaveBeenCalledTimes(1);
    expect(setIsToastVisible).toHaveBeenCalledWith(false);

    // Advance past when the original timer would have fired
    vi.advanceTimersByTime(1500);
    // setIsToastVisible should not have been called again by the timer
    expect(setIsToastVisible).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
