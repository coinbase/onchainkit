import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Address } from './Address';
import { Avatar } from './Avatar';
import { EthBalance } from './EthBalance';
import { IdentityLayout } from './IdentityLayout';
import { Name } from './Name';

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

vi.mock('../../useTheme', () => ({
  useTheme: vi.fn(),
}));

const renderComponent = () => {
  return render(
    <IdentityLayout className="custom-class">
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
});
