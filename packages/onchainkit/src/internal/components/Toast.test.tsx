import { act } from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import { Toast } from './Toast';

describe('Toast component', () => {
  it('should render bottom-right with default animation correctly', () => {
    const handleClose = vi.fn();
    const { getByTestId } = render(
      <Toast open={true} position="bottom-right" onClose={handleClose}>
        <div>Test</div>
      </Toast>,
    );

    const toastContainer = getByTestId('ockToastViewport');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('bottom-5 left-3/4');

    const toast = getByTestId('ockToast');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('animate-enterRight');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  it('should render bottom-right with custom animation correctly', () => {
    const handleClose = vi.fn();
    const { getByTestId } = render(
      <Toast
        open={true}
        position="bottom-right"
        animation
        onClose={handleClose}
      >
        <div>Test</div>
      </Toast>,
    );

    const toastContainer = getByTestId('ockToastViewport');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('bottom-5 left-3/4');

    const toast = getByTestId('ockToast');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('animate-enterRight');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  it('should render top-right with default animation correctly', () => {
    const handleClose = vi.fn();
    const { getByTestId } = render(
      <Toast open={true} position="top-right" onClose={handleClose}>
        <div>Test</div>
      </Toast>,
    );

    const toastContainer = getByTestId('ockToastViewport');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('top-[100px] left-3/4');

    const toast = getByTestId('ockToast');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('animate-enterRight');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  it('should render top-right with custom animation correctly', () => {
    const handleClose = vi.fn();
    const { getByTestId } = render(
      <Toast open={true} position="top-right" animation onClose={handleClose}>
        <div>Test</div>
      </Toast>,
    );

    const toastContainer = getByTestId('ockToastViewport');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('top-[100px] left-3/4');

    const toast = getByTestId('ockToast');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('animate-enterRight');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  it('should render top-center with default animation correctly', () => {
    const handleClose = vi.fn();
    const { getByTestId } = render(
      <Toast open={true} position="top-center" onClose={handleClose}>
        <div>Test</div>
      </Toast>,
    );

    const toastContainer = getByTestId('ockToastViewport');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('top-[100px] left-2/4');

    const toast = getByTestId('ockToast');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('animate-enterDown');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  it('should render top-center with custom animation correctly', () => {
    const handleClose = vi.fn();
    const { getByTestId } = render(
      <Toast open={true} position="top-center" animation onClose={handleClose}>
        <div>Test</div>
      </Toast>,
    );

    const toastContainer = getByTestId('ockToastViewport');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('top-[100px] left-2/4');

    const toast = getByTestId('ockToast');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('animate-enterDown');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  it('should render bottom-center with default animation correctly', () => {
    const handleClose = vi.fn();
    const { getByTestId } = render(
      <Toast open={true} position="bottom-center" onClose={handleClose}>
        <div>Test</div>
      </Toast>,
    );

    const toastContainer = getByTestId('ockToastViewport');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('bottom-5 left-2/4');

    const toast = getByTestId('ockToast');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('animate-enterUp');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  it('should render bottom-center with custom animation correctly', () => {
    const handleClose = vi.fn();
    const { getByTestId } = render(
      <Toast
        open={true}
        position="bottom-center"
        animation
        onClose={handleClose}
      >
        <div>Test</div>
      </Toast>,
    );

    const toastContainer = getByTestId('ockToastViewport');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('bottom-5 left-2/4');

    const toast = getByTestId('ockToast');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('animate-enterUp');

    const closeButton = getByTestId('ockCloseButton');
    expect(closeButton).toBeInTheDocument();
  });

  it('should apply custom className correctly', () => {
    const handleClose = vi.fn();
    const { getByTestId } = render(
      <Toast
        open={true}
        position="bottom-right"
        onClose={handleClose}
        className="custom-class"
      >
        <div>Test</div>
      </Toast>,
    );

    const toast = getByTestId('ockToast');
    expect(toast).toHaveClass('custom-class');
  });

  it('should not be visible when open is false', () => {
    const handleClose = vi.fn();
    const { queryByTestId } = render(
      <Toast open={false} position="bottom-right" onClose={handleClose}>
        <div>Test</div>
      </Toast>,
    );
    const toastContainer = queryByTestId('ockToast');
    expect(toastContainer).not.toBeInTheDocument();
  });

  it('should close when close button is clicked', () => {
    const handleClose = vi.fn();
    const { getByTestId } = render(
      <Toast open={true} position="bottom-right" onClose={handleClose}>
        <div>Test</div>
      </Toast>,
    );

    const closeButton = getByTestId('ockCloseButton');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalled();
  });

  it('should render children correctly', () => {
    const handleClose = vi.fn();
    const { getByText } = render(
      <Toast open position="bottom-right" onClose={handleClose}>
        <div>Test</div>
      </Toast>,
    );

    const text = getByText('Test');
    expect(text).toBeInTheDocument();
  });

  it('should disappear after durationMs', async () => {
    vi.useFakeTimers();
    const handleClose = vi.fn();
    const durationMs = 2000;

    render(
      <Toast
        open
        position="bottom-right"
        onClose={handleClose}
        duration={durationMs}
      >
        <div>Test</div>
      </Toast>,
    );

    expect(handleClose).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(durationMs);
    });

    expect(handleClose).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
