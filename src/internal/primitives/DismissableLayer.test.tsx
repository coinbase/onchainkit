import { fireEvent, render, screen } from '@testing-library/react';
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

    const innerElement = screen.getByTestId('inner');
    fireEvent.pointerDown(innerElement);
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

  it('handles case when both disableEscapeKey and disableOutsideClick are true', () => {
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
    render(
      <>
        <button type="button" aria-label="Toggle swap settings">
          Trigger
        </button>
        <DismissableLayer onDismiss={onDismiss}>
          <div>Test Content</div>
        </DismissableLayer>
      </>,
    );

    const triggerButton = screen.getByLabelText('Toggle swap settings');
    fireEvent.pointerDown(triggerButton);
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
