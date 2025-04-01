import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TextInput } from './TextInput';

const DELAY_MS = 100;

type RenderTestProps = {
  className?: string;
  delayMs?: number;
  onChange?: (s: string) => void;
  placeholder?: string;
  setValue?: (s: string) => void;
  value?: string;
  disabled?: boolean;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode'];
};

const RenderTest = ({
  className = 'custom-class',
  delayMs = DELAY_MS,
  onChange = vi.fn(),
  placeholder = 'Enter text',
  setValue = vi.fn(),
  value = 'test',
  ...props
}: RenderTestProps) => (
  <TextInput
    className={className}
    delayMs={delayMs}
    onChange={onChange}
    placeholder={placeholder}
    setValue={setValue}
    value={value}
    {...props}
  />
);

describe('TextInput', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with default props', () => {
    render(<RenderTest />);
    expect(screen.getByTestId('ockTextInput_Input')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(<RenderTest onChange={onChange} />);

    const input = getByTestId('ockTextInput_Input');
    act(() => {
      fireEvent.change(input, { target: { value: '2' } });
    });

    vi.advanceTimersByTime(DELAY_MS);

    expect(onChange).toHaveBeenCalledWith('2');
  });

  it('applies custom className', () => {
    render(<RenderTest />);
    expect(screen.getByTestId('ockTextInput_Input')).toHaveClass(
      'custom-class',
    );
  });

  it('handles placeholder text', () => {
    render(<RenderTest />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<RenderTest disabled={true} />);
    expect(screen.getByTestId('ockTextInput_Input')).toBeDisabled();
  });

  it('handles inputMode', () => {
    const { getByTestId } = render(<RenderTest inputMode="decimal" />);
    expect(getByTestId('ockTextInput_Input')).toHaveAttribute(
      'inputMode',
      'decimal',
    );
  });
});
