import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner component', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<Spinner />);

    const spinnerContainer = getByTestId('ockSpinner');
    expect(spinnerContainer).toBeInTheDocument();

    const spinner = spinnerContainer.firstChild;
    expect(spinner).toHaveClass(
      'animate-spin border-2 border-gray-200 border-t-3 rounded-full border-t-gray-400 px-2.5 py-2.5',
    );
  });
});
