/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { SwapTokensButton } from './SwapTokensButton';

const handleClick = jest.fn();

describe('SwapTokensButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', async () => {
    render(<SwapTokensButton onClick={handleClick} />);

    const tokenSelector = screen.getByTestId('SwapTokensButton');
    expect(tokenSelector).toBeInTheDocument();

    const swapIcon = screen.getByTestId('SwapIcon');
    expect(swapIcon).toBeInTheDocument();
  });

  it('should register a click on press', async () => {
    render(<SwapTokensButton onClick={handleClick} />);

    const tokenSelector = screen.getByTestId('SwapTokensButton');

    fireEvent.click(tokenSelector);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
