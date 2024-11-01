import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Address } from './Address';
import { Avatar } from './Avatar';
import { EthBalance } from './EthBalance';
import { IdentityLayout } from './IdentityLayout';
import { Name } from './Name';
import { Socials } from './Socials';

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

vi.mock('./Socials', () => ({
  Socials: vi.fn(() => <div>Socials</div>),
}));

vi.mock('../../useTheme', () => ({
  useTheme: vi.fn(),
}));

const renderComponent = (props = {}) => {
  return render(
    <IdentityLayout className="custom-class" {...props}>
      <Avatar />
      <Name />
      <Address />
      <EthBalance />
      <Socials />
    </IdentityLayout>,
  );
};

describe('IdentityLayout', () => {
  it('should render all children components when present', () => {
    renderComponent();
    expect(screen.getByText('Avatar')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('EthBalance')).toBeInTheDocument();
    expect(screen.getByText('Socials')).toBeInTheDocument();
  });

  it('should render with custom class', () => {
    renderComponent();
    expect(screen.getByTestId('ockIdentityLayout_container')).toHaveClass(
      'custom-class',
    );
  });

  it('should render correctly without Address component', () => {
    render(
      <IdentityLayout className="custom-class">
        <Avatar />
        <Name />
        <EthBalance />
      </IdentityLayout>,
    );
    expect(screen.getByText('Avatar')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('EthBalance')).toBeInTheDocument();
    expect(screen.queryByText('Address')).not.toBeInTheDocument();
  });

  it('should render correctly without EthBalance component', () => {
    render(
      <IdentityLayout>
        <Avatar />
        <Name />
        <Address />
      </IdentityLayout>,
    );
    expect(screen.getByText('Avatar')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.queryByText('EthBalance')).not.toBeInTheDocument();
  });

  it('should render correctly without Socials component', () => {
    render(
      <IdentityLayout>
        <Avatar />
        <Name />
        <Address />
        <EthBalance />
      </IdentityLayout>,
    );
    expect(screen.getByText('Avatar')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('EthBalance')).toBeInTheDocument();
    expect(screen.queryByText('Socials')).not.toBeInTheDocument();
  });

  it('should render correctly with only required components', () => {
    render(
      <IdentityLayout>
        <Avatar />
        <Name />
      </IdentityLayout>,
    );
    expect(screen.getByText('Avatar')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.queryByText('Address')).not.toBeInTheDocument();
    expect(screen.queryByText('EthBalance')).not.toBeInTheDocument();
    expect(screen.queryByText('Socials')).not.toBeInTheDocument();
  });

  it('should pass hasCopyAddressOnClick prop correctly to Address component', () => {
    render(
      <IdentityLayout hasCopyAddressOnClick={true}>
        <Avatar />
        <Name />
        <Address />
      </IdentityLayout>,
    );
    expect(Address).toHaveBeenCalledWith(
      expect.objectContaining({ hasCopyAddressOnClick: true }),
      expect.anything(),
    );
  });

  it('should pass undefined hasCopyAddressOnClick when prop is not provided', () => {
    render(
      <IdentityLayout>
        <Avatar />
        <Name />
        <Address />
      </IdentityLayout>,
    );
    expect(Address).toHaveBeenCalledWith(
      expect.objectContaining({ hasCopyAddressOnClick: undefined }),
      expect.anything(),
    );
  });
});
