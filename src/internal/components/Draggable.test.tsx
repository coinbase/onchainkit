import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Draggable from './Draggable';

describe('Draggable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children correctly', () => {
    render(
      <Draggable>
        <div>Drag me</div>
      </Draggable>,
    );
    expect(screen.getByTestId('ockDraggable')).toBeInTheDocument();
  });

  it('starts at the default position if no starting position is provided', () => {
    render(
      <Draggable>
        <div>Drag me</div>
      </Draggable>,
    );
    const draggable = screen.getByTestId('ockDraggable');
    expect(draggable).toHaveStyle({ left: '20px', top: '20px' });
  });

  it('starts at the specified position if starting position is provided', () => {
    render(
      <Draggable startingPosition={{ x: 100, y: 100 }}>
        <div>Drag me</div>
      </Draggable>,
    );
    const draggable = screen.getByTestId('ockDraggable');
    expect(draggable).toHaveStyle({ left: '100px', top: '100px' });
  });

  it('changes cursor style when dragging', () => {
    render(
      <Draggable>
        <div>Drag me</div>
      </Draggable>,
    );
    const draggable = screen.getByTestId('ockDraggable');
    expect(draggable).toHaveClass('cursor-grab');

    fireEvent.mouseDown(draggable);
    expect(draggable).toHaveClass('cursor-grabbing');

    fireEvent.mouseUp(draggable);
    expect(draggable).toHaveClass('cursor-grab');
  });

  it('snaps to grid when dragging ends', () => {
    render(
      <Draggable gridSize={10} startingPosition={{ x: 0, y: 0 }}>
        <div>Drag me</div>
      </Draggable>,
    );

    const draggable = screen.getByTestId('ockDraggable');
    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 14, clientY: 16 });
    fireEvent.mouseUp(document);
    expect(draggable).toHaveStyle({ left: '10px', top: '20px' });
  });

  it('handles touch events', () => {
    render(
      <Draggable>
        <div>Drag me</div>
      </Draggable>,
    );
    const draggable = screen.getByTestId('ockDraggable');

    fireEvent.touchStart(draggable, {
      touches: [{ clientX: 0, clientY: 0 }],
    });
    expect(draggable).toHaveClass('cursor-grabbing');

    fireEvent.touchMove(document, {
      touches: [{ clientX: 50, clientY: 50 }],
    });

    fireEvent.touchEnd(document);
    expect(draggable).toHaveClass('cursor-grab');
  });

  it('calculates drag offset correctly', () => {
    render(
      <Draggable startingPosition={{ x: 50, y: 50 }}>
        <div>Drag me</div>
      </Draggable>,
    );
    const draggable = screen.getByTestId('ockDraggable');

    fireEvent.mouseDown(draggable, { clientX: 60, clientY: 70 });
    expect(draggable).toHaveStyle({ left: '50px', top: '50px' });

    // Move with the calculated offset
    fireEvent.mouseMove(document, { clientX: 80, clientY: 90 });
    expect(draggable).toHaveStyle({ left: '70px', top: '70px' });
  });

  it('updates position during drag movement', () => {
    render(
      <Draggable startingPosition={{ x: 0, y: 0 }}>
        <div>Drag me</div>
      </Draggable>,
    );
    const draggable = screen.getByTestId('ockDraggable');

    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 });

    // Multiple move events
    fireEvent.mouseMove(document, { clientX: 50, clientY: 50 });
    expect(draggable).toHaveStyle({ left: '50px', top: '50px' });

    fireEvent.mouseMove(document, { clientX: 100, clientY: 75 });
    expect(draggable).toHaveStyle({ left: '100px', top: '75px' });
  });

  it('cleans up event listeners when unmounted during drag', () => {
    const { unmount } = render(
      <Draggable>
        <div>Drag me</div>
      </Draggable>,
    );
    const draggable = screen.getByTestId('ockDraggable');

    // Start dragging
    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 });

    // Unmount while dragging
    unmount();

    // Verify no errors when moving/ending after unmount
    fireEvent.mouseMove(document, { clientX: 50, clientY: 50 });
    fireEvent.mouseUp(document);
  });
});
