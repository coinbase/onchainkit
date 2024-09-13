import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Address } from './Address';
import { Avatar } from './Avatar';
import { EthBalance } from './EthBalance';
import { IdentityLayout } from './IdentityLayout';
import { Name } from './Name';

const handleCopy = vi.fn().mockResolvedValue(true);

vi.mock('./Avatar', () => ({
  Avatar: vi.fn(() => <div>Avatar</div>),
}));

vi.mock('./Name', () => ({
  Name: vi.fn(() => <div>Name</div>),
}));

vi.mock('./Address', () => ({
  Address: vi.fn(() => <div>Address</div>),
}));

vi.mock('./EthBalance', () => ({
  EthBalance: vi.fn(() => <div>EthBalance</div>),
}));

const renderComponent = () => {
  return render(
    <IdentityLayout onClick={handleCopy} className="custom-class">
      <Avatar />
      <Name />
      <Address />
      <EthBalance />
    </IdentityLayout>,
  );
};

describe('IdentityLayout', () => {
  it('should render children', () => {
    renderComponent();
    expect(screen.getByText('Avatar')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('EthBalance')).toBeInTheDocument();
  });

  it('should render with custom class', () => {
    renderComponent();
    expect(screen.getByTestId('ockIdentityLayout_container')).toHaveClass(
      'custom-class',
    );
  });

  it('should show popover on hover and hides on mouse leave', async () => {
    renderComponent();
    const container = screen.getByTestId('ockIdentityLayout_container');
    fireEvent.mouseEnter(container);
    await waitFor(() => {
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });
    fireEvent.mouseLeave(container);
    await waitFor(() => {
      expect(screen.queryByText('Copy')).not.toBeInTheDocument();
    });
  });

  it('should show popover on click and hides after 1s', async () => {
    renderComponent();
    const container = screen.getByTestId('ockIdentityLayout_container');
    fireEvent.mouseEnter(container);
    await waitFor(() => {
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });
    fireEvent.click(container);
    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
    await waitFor(
      () => {
        expect(screen.queryByText('Copied')).not.toBeInTheDocument();
      },
      {
        timeout: 1001,
      },
    );
  });

  it('should change popover text to "Copied" on click', async () => {
    renderComponent();
    const container = screen.getByTestId('ockIdentityLayout_container');
    fireEvent.mouseEnter(container);
    await waitFor(() => {
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });
    fireEvent.click(container);
    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
  });

  it('should not show popover on key up', async () => {
    renderComponent();
    const container = screen.getByTestId('ockIdentityLayout_container');
    fireEvent.keyUp(container);
    await waitFor(() => {
      expect(screen.queryByText('Copy')).not.toBeInTheDocument();
    });
  });

  it('should not show popover on key down', async () => {
    renderComponent();
    const container = screen.getByTestId('ockIdentityLayout_container');
    fireEvent.keyDown(container);
    await waitFor(() => {
      expect(screen.queryByText('Copy')).not.toBeInTheDocument();
    });
  });
});
