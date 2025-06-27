import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NFTErrorFallback } from './NFTErrorFallback';

describe('NFTErrorFallback', () => {
  it('should render', () => {
    const error = new Error('Test error message');

    const { getByText } = render(<NFTErrorFallback error={error} />);

    expect(getByText('Sorry, please try again later.')).toBeInTheDocument();
    expect(getByText('Test error message')).toBeInTheDocument();
  });
});
