import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { useOnchainKit } from '../../../useOnchainKit';
import { useNFTContext } from '../NFTProvider';
import { NFTOwner } from './NFTOwner';

vi.mock('../../../useOnchainKit');
vi.mock('../NFTProvider');
vi.mock('../../../identity', async () => ({
  ...(await vi.importActual('../../../identity')),
  Identity: ({ className, address }) => (
    <div className={className}>{address}</div>
  ),
}));

describe('NFTOwner', () => {
  const mockUseOnchainKit = useOnchainKit as Mock;
  const mockUseNFTContext = useNFTContext as Mock;

  beforeEach(() => {
    mockUseOnchainKit.mockReturnValue({ schemaId: 'test-schema-id' });
    mockUseNFTContext.mockReturnValue({
      ownerAddress: 'test-owner-address',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with default label', () => {
    const { getByText } = render(<NFTOwner />);
    expect(getByText('Owned by')).toBeInTheDocument();
  });

  it('should render correctly with custom label', () => {
    const { getByText } = render(<NFTOwner label="Custom Label" />);
    expect(getByText('Custom Label')).toBeInTheDocument();
  });

  it('should not render if ownerAddress is not provided', () => {
    mockUseNFTContext.mockReturnValueOnce({ ownerAddress: null });
    const { container } = render(<NFTOwner />);
    expect(container.firstChild).toBeNull();
  });

  it('should render Identity component with correct props', () => {
    const { getByText } = render(<NFTOwner />);
    expect(getByText('test-owner-address')).toBeInTheDocument();
  });
});
