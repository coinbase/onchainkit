import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTheme } from '../../useTheme';
import { NFTErrorFallback } from './NFTErrorFallback';

vi.mock('../../useTheme');

describe('NFTErrorFallback', () => {
  beforeEach(() => {
    (useTheme as Mock).mockReturnValue('default-light');
  });
  it('should render', () => {
    const error = new Error('Test error message');

    const { getByText } = render(<NFTErrorFallback error={error} />);

    expect(getByText('Sorry, please try again later.')).toBeInTheDocument();
    expect(getByText('Test error message')).toBeInTheDocument();
  });
});
