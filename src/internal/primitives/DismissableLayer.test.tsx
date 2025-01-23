import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DismissableLayer } from './DismissableLayer';

describe('DismissableLayer', () => {
  const onDismiss = vi.fn();

  beforeEach(() => {
    onDismiss.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders children correctly', () => {
    render(
      <DismissableLayer>
        <div data-testid="child">Test Content</div>
      </DismissableLayer>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('calls onDismiss when Escape key is pressed', () => {
    render(
      <DismissableLayer onDismiss={onDismiss}>
        <div>Test Content</div>
      </DismissableLayer>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not call onDismiss when Escape key is pressed and disableEscapeKey is true', () => {
    render(
      <DismissableLayer onDismiss={onDismiss} disableEscapeKey={true}>
        <div>Test Content</div>
      </DismissableLayer>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('calls onDismiss when clicking outside', () => {
    render(
      <DismissableLayer onDismiss={onDismiss}>
        <div>Test Content</div>
      </DismissableLayer>,
    );

    fireEvent.pointerDown(document.body);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not call onDismiss when clicking inside', () => {
    render(
      <DismissableLayer onDismiss={onDismiss}>
        <div data-testid="inner">Test Content</div>
      </DismissableLayer>,
    );

    fireEvent.pointerDown(screen.getByTestId('inner'));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('handles trigger clicks with preventTriggerBubbling', () => {
    const TestComponent = () => {
      const triggerRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button type="button" ref={triggerRef} data-testid="trigger">
            Trigger
          </button>
          <DismissableLayer
            onDismiss={onDismiss}
            triggerRef={triggerRef}
            preventTriggerEvents={true}
          >
            <div>Content</div>
          </DismissableLayer>
        </>
      );
    };

    render(<TestComponent />);

    const event = new Event('pointerdown', { bubbles: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    Object.defineProperty(event, 'stopPropagation', { value: vi.fn() });

    const trigger = screen.getByTestId('trigger');
    trigger.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('handles trigger clicks without preventTriggerBubbling', () => {
    const TestComponent = () => {
      const triggerRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button type="button" ref={triggerRef} data-testid="trigger">
            Trigger
          </button>
          <DismissableLayer onDismiss={onDismiss} triggerRef={triggerRef}>
            <div>Content</div>
          </DismissableLayer>
        </>
      );
    };

    render(<TestComponent />);

    const event = new Event('pointerdown', { bubbles: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    Object.defineProperty(event, 'stopPropagation', { value: vi.fn() });

    const trigger = screen.getByTestId('trigger');
    trigger.dispatchEvent(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(event.stopPropagation).not.toHaveBeenCalled();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('handles both disableEscapeKey and disableOutsideClick being true', () => {
    render(
      <DismissableLayer
        onDismiss={onDismiss}
        disableEscapeKey={true}
        disableOutsideClick={true}
      >
        <div>Test Content</div>
      </DismissableLayer>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.pointerDown(document.body);

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('handles undefined onDismiss prop gracefully', () => {
    render(
      <DismissableLayer>
        <div>Test Content</div>
      </DismissableLayer>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.pointerDown(document.body);
  });

  it('does not call onDismiss when clicking the trigger button', () => {
    const TestComponent = () => {
      const triggerRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button
            type="button"
            ref={triggerRef}
            aria-label="Toggle swap settings"
          >
            Trigger
          </button>
          <DismissableLayer onDismiss={onDismiss} triggerRef={triggerRef}>
            <div>Test Content</div>
          </DismissableLayer>
        </>
      );
    };

    render(<TestComponent />);

    const triggerButton = screen.getByLabelText('Toggle swap settings');
    fireEvent.pointerDown(triggerButton);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does not call onDismiss when clicking outside and disableOutsideClick is true', () => {
    render(
      <DismissableLayer onDismiss={onDismiss} disableOutsideClick={true}>
        <div>Test Content</div>
      </DismissableLayer>,
    );

    fireEvent.pointerDown(document.body);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('handles non-Node event target gracefully', () => {
    render(
      <DismissableLayer onDismiss={onDismiss}>
        <div>Test Content</div>
      </DismissableLayer>,
    );

    const event = new Event('pointerdown', { bubbles: true });
    // Create a non-Node object as target
    Object.defineProperty(event, 'target', { value: {} });
    document.dispatchEvent(event);

    expect(onDismiss).not.toHaveBeenCalled();
  });
});
