/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Swap } from './Swap';

jest.mock('wagmi', () => {
  return {
    useBalance: jest.fn(),
    useReadContract: jest.fn(),
  };
});

jest.mock('../../internal/text', () => {
  return {
    TextTitle3: ({ children }: { children: string }) => <div>{children}</div>,
  };
});

describe('Swap component', () => {
  it('should render with default title', () => {
    render(
      <Swap address="0x123">
        <div />
        <div />
      </Swap>,
    );

    const title = screen.getByText('Swap');
    expect(title).toBeInTheDocument();
  });

  it('should render with custom title', () => {
    const title = 'Hello Onchain';

    render(
      <Swap address="0x123" title={title}>
        <div />
        <div />
      </Swap>,
    );

    const element = screen.getByText(title);
    expect(element).toBeInTheDocument();
  });
});
