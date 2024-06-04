/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { TokenImage } from './TokenImage';

describe('TokenImage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with src prop', async () => {
    render(<TokenImage src="https://link/to/image.png" />);
    const imgElement = screen.getByTestId('ockTokenImage_Image');
    const noImgElement = screen.queryByTestId('ockTokenImage_NoImage');

    expect(imgElement).toBeInTheDocument();
    expect(noImgElement).toBeNull();
  });

  it('should render with no src prop', async () => {
    render(<TokenImage src={null} />);
    const imgElement = screen.queryByTestId('ockTokenImage_Image');
    const noImgElement = screen.getByTestId('ockTokenImage_NoImage');

    expect(imgElement).toBeNull();
    expect(noImgElement).toBeInTheDocument();
  });

  it('should render with size prop', async () => {
    render(<TokenImage src={null} size={16} />);
    const imgElement = screen.queryByTestId('ockTokenImage_Image');
    const noImgElement = screen.getByTestId('ockTokenImage_NoImage');

    expect(imgElement).toBeNull();
    expect(noImgElement).toBeInTheDocument();
  });
});
