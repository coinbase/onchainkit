/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Address } from './Address';
import { useIdentityContext } from '../context';
import { getSlicedAddress } from '../getSlicedAddress';

jest.mock('../context', () => ({
  useIdentityContext: jest.fn(),
}));

describe('Address component', () => {
  it('renders the sliced address', () => {
    const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
    (useIdentityContext as jest.Mock).mockReturnValue({ address: mockAddress });

    const { getByText } = render(<Address className="test-class" />);

    expect(getByText(getSlicedAddress(mockAddress))).toBeInTheDocument();
  });

  // it('applies the correct class names', () => {
  //   const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
  //   (useIdentityContext as jest.Mock).mockReturnValue({ address: mockAddress });
  //
  //   const { container } = render(<Address className="test-class" />);
  //
  //   const spanElement = container.querySelector('span');
  //   expect(spanElement).toHaveClass('test-class');
  //   expect(spanElement).toHaveClass('label2'); // Assuming `text.label2` resolves to 'label2'
  // });
});
