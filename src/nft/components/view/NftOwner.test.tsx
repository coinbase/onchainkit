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
import { useNftContext } from '../NftProvider';
import { NftOwner } from './NftOwner';

vi.mock('../../../useOnchainKit');
vi.mock('../NftProvider');
vi.mock('../../../identity', async () => ({
  ...(await vi.importActual('../../../identity')),
  Identity: ({ className, address }) => (
    <div className={className}>{address}</div>
  ),
}));

describe('NftOwner', () => {
  const mockUseOnchainKit = useOnchainKit as Mock;
  const mockUseNftContext = useNftContext as Mock;

  beforeEach(() => {
    mockUseOnchainKit.mockReturnValue({ schemaId: 'test-schema-id' });
    mockUseNftContext.mockReturnValue({
      ownerAddress: 'test-owner-address',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with default label', () => {
    const { getByText } = render(<NftOwner />);
    expect(getByText('Owned by')).toBeInTheDocument();
  });

  it('should render correctly with custom label', () => {
    const { getByText } = render(<NftOwner label="Custom Label" />);
    expect(getByText('Custom Label')).toBeInTheDocument();
  });

  it('should not render if ownerAddress is not provided', () => {
    mockUseNftContext.mockReturnValueOnce({ ownerAddress: null });
    const { container } = render(<NftOwner />);
    expect(container.firstChild).toBeNull();
  });

  it('should render Identity component with correct props', () => {
    const { getByText } = render(<NftOwner />);
    expect(getByText('test-owner-address')).toBeInTheDocument();
  });
});
