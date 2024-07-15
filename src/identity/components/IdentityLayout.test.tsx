import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
  it('shows popover on hover and hides on mouse leave', async () => {
    renderComponent();

    const container = screen.getByTestId('ockIdentity_container');
    fireEvent.mouseEnter(container);

    await waitFor(() => {
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });

    fireEvent.mouseLeave(container);

    await waitFor(() => {
      expect(screen.queryByText('Copy')).not.toBeInTheDocument();
    });
  });

  it('changes popover text to "Copied" on click', async () => {
    renderComponent();

    const container = screen.getByTestId('ockIdentity_container');
    fireEvent.mouseEnter(container);

    await waitFor(() => {
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });

    fireEvent.click(container);

    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
  });
});
