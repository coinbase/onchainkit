import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { FocusTrap } from './FocusTrap';

describe('FocusTrap', () => {
  beforeEach(() => {
    document.body.focus();
  });

  it('renders children correctly', () => {
    render(
      <FocusTrap>
        <div data-testid="child">Test Content</div>
      </FocusTrap>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('focuses first focusable element when mounted', () => {
    render(
      <FocusTrap>
        <div>
          <button type="button" data-testid="first">
            First
          </button>
          <button type="button">Second</button>
        </div>
      </FocusTrap>,
    );

    expect(screen.getByTestId('first')).toHaveFocus();
  });

  it('does not trap focus when active is false', () => {
    render(
      <FocusTrap active={false}>
        <div>
          <button type="button" data-testid="first">
            First
          </button>
          <button type="button">Second</button>
        </div>
      </FocusTrap>,
    );

    expect(screen.getByTestId('first')).not.toHaveFocus();
  });

  it('cycles focus forward with Tab key', async () => {
    const user = userEvent.setup();

    render(
      <FocusTrap>
        <div>
          <button type="button" data-testid="first">
            First
          </button>
          <button type="button" data-testid="second">
            Second
          </button>
          <button type="button" data-testid="third">
            Third
          </button>
        </div>
      </FocusTrap>,
    );

    const first = screen.getByTestId('first');
    const second = screen.getByTestId('second');
    const third = screen.getByTestId('third');

    expect(first).toHaveFocus();

    await user.tab();
    expect(second).toHaveFocus();

    await user.tab();
    expect(third).toHaveFocus();

    await user.tab();
    expect(first).toHaveFocus();
  });

  it('cycles focus backward with Shift+Tab', async () => {
    const user = userEvent.setup();

    render(
      <FocusTrap>
        <div>
          <button type="button" data-testid="first">
            First
          </button>
          <button type="button" data-testid="second">
            Second
          </button>
          <button type="button" data-testid="third">
            Third
          </button>
        </div>
      </FocusTrap>,
    );

    const first = screen.getByTestId('first');
    const second = screen.getByTestId('second');
    const third = screen.getByTestId('third');

    expect(first).toHaveFocus();

    await user.tab({ shift: true });
    expect(third).toHaveFocus();

    await user.tab({ shift: true });
    expect(second).toHaveFocus();

    await user.tab({ shift: true });
    expect(first).toHaveFocus();
  });

  it('handles container with no focusable elements', () => {
    render(
      <FocusTrap>
        <div data-testid="no-focusable">
          <p>No focusable elements here</p>
        </div>
      </FocusTrap>,
    );

    const container = screen.getByTestId('no-focusable');
    fireEvent.keyDown(container, { key: 'Tab' });
  });

  it('ignores non-Tab key events', () => {
    render(
      <FocusTrap>
        <div>
          <button type="button" data-testid="first">
            First
          </button>
          <button type="button" data-testid="second">
            Second
          </button>
        </div>
      </FocusTrap>,
    );

    const first = screen.getByTestId('first');

    fireEvent.keyDown(first, { key: 'Enter' });
    expect(first).toHaveFocus();

    fireEvent.keyDown(first, { key: ' ' });
    expect(first).toHaveFocus();
  });
});
