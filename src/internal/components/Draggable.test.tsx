import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

    fireEvent.pointerDown(draggable);
    expect(draggable).toHaveClass('cursor-grabbing');

    fireEvent.pointerUp(draggable);
    expect(draggable).toHaveClass('cursor-grab');
  });

  it('snaps to grid when dragging ends if enableSnapToGrid is true', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Draggable gridSize={10} startingPosition={{ x: 0, y: 0 }}>
        <div>Drag me</div>
      </Draggable>,
    );

    const draggable = screen.getByTestId('ockDraggable');
    await user.pointer([
      { keys: '[MouseLeft>]', target: draggable },
      { coords: { x: 14, y: 16 } },
      { keys: '[/MouseLeft]' },
    ]);
    expect(draggable).toHaveStyle({ left: '10px', top: '20px' });
  });

  it('does not snap to grid when dragging ends if enableSnapToGrid is false', async () => {
    const user = userEvent.setup();
    render(
      <Draggable
        gridSize={10}
        startingPosition={{ x: 0, y: 0 }}
        enableSnapToGrid={false}
      >
        <div>Drag me</div>
      </Draggable>,
    );

    const draggable = screen.getByTestId('ockDraggable');
    await user.pointer([
      { keys: '[MouseLeft>]', target: draggable },
      { coords: { x: 14, y: 16 } },
      { keys: '[/MouseLeft]' },
    ]);
    expect(draggable).toHaveStyle({ left: '14px', top: '16px' });
  });

  it('handles touch events', () => {
    render(
      <Draggable>
        <div>Drag me</div>
      </Draggable>,
    );
    const draggable = screen.getByTestId('ockDraggable');

    fireEvent.pointerDown(draggable, {
      clientX: 0,
      clientY: 0,
    });
    expect(draggable).toHaveClass('cursor-grabbing');

    fireEvent.pointerMove(document, {
      clientX: 50,
      clientY: 50,
    });

    fireEvent.pointerUp(document);
    expect(draggable).toHaveClass('cursor-grab');
  });

  it('calculates drag offset correctly', async () => {
    const user = userEvent.setup();
    render(
      <Draggable startingPosition={{ x: 50, y: 50 }}>
        <div>Drag me</div>
      </Draggable>,
    );
    const draggable = screen.getByTestId('ockDraggable');

    await user.pointer([
      { keys: '[MouseLeft>]', target: draggable, coords: { x: 60, y: 70 } },
      { coords: { x: 80, y: 90 } },
      { keys: '[/MouseLeft]' },
    ]);
    expect(draggable).toHaveStyle({ left: '70px', top: '70px' });
  });

  it('updates position during drag movement', async () => {
    const user = userEvent.setup();
    render(
      <Draggable startingPosition={{ x: 0, y: 0 }}>
        <div>Drag me</div>
      </Draggable>,
    );
    const draggable = screen.getByTestId('ockDraggable');

    await user.pointer([
      { keys: '[MouseLeft>]', target: draggable, coords: { x: 0, y: 0 } },
      { coords: { x: 50, y: 50 } },
    ]);
    expect(draggable).toHaveStyle({ left: '50px', top: '50px' });

    await user.pointer([
      { coords: { x: 100, y: 75 } },
    ])

    expect(draggable).toHaveStyle({ left: '100px', top: '75px' });
  });

  it('cleans up event listeners when unmounted during drag', () => {
    const { unmount } = render(
      <Draggable>
        <div>Drag me</div>
      </Draggable>,
    );
    const draggable = screen.getByTestId('ockDraggable');

    const removeSpy = vi.spyOn(document, 'removeEventListener');

    fireEvent.pointerDown(draggable, { clientX: 0, clientY: 0 });

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
  });
});
