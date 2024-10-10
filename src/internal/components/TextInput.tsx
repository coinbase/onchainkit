import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { useDebounce } from '../hooks/useDebounce';

type TextInputReact = {
  'aria-label'?: string;
  className: string;
  delayMs: number;
  disabled?: boolean;
  onBlur?: () => void;
  onChange: (s: string) => void;
  placeholder: string;
  setValue: (s: string) => void;
  value: string;
  inputValidator?: (s: string) => boolean;
};

export function TextInput({
  'aria-label': ariaLabel,
  className,
  delayMs,
  disabled = false,
  onBlur,
  onChange,
  placeholder,
  setValue,
  value,
  inputValidator = () => true,
}: TextInputReact) {
  const handleDebounce = useDebounce((value) => {
    onChange(value);
  }, delayMs);

  const handleChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const value = evt.target.value;

      if (inputValidator(value)) {
        setValue(value);
        if (delayMs > 0) {
          handleDebounce(value);
        } else {
          onChange(value);
        }
      }
    },
    [onChange, handleDebounce, delayMs, setValue, inputValidator],
  );

  return (
    <input
      aria-label={ariaLabel}
      data-testid="ockTextInput_Input"
      type="text"
      className={className}
      placeholder={placeholder}
      value={value}
      onBlur={onBlur}
      onChange={handleChange}
      disabled={disabled}
    />
  );
}
