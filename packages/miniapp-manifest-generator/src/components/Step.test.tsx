import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Step } from './Step';

describe('Step', () => {
  it('should render', () => {
    render(
      <Step number={1} label="Test Label">
        <div>Test Content</div>
      </Step>,
    );

    expect(screen.getByTestId('manifestStep')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByTestId('manifestStep')).not.toHaveClass('opacity-50');
  });

  it('should render description', () => {
    render(
      <Step number={1} label="Test Label" description="Test Description">
        <div>Test Content</div>
      </Step>,
    );

    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should apply opacity-50 class when disabled', () => {
    render(
      <Step number={1} label="Test Label" disabled>
        <div>Test Content</div>
      </Step>,
    );

    expect(screen.getByTestId('manifestStep')).toHaveClass('opacity-50');
  });

  it('should render multiple complex children', () => {
    render(
      <Step number={1} label="Test Label">
        <div className="flex flex-col gap-2">
          <div>Child 1</div>
          <div>Child 2</div>
        </div>
      </Step>,
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});
