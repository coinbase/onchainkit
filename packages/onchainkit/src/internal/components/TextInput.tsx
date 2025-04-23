import {
  type ChangeEvent,
  type InputHTMLAttributes,
  forwardRef,
  useCallback,
} from 'react';
import { useDebounce } from '../hooks/useDebounce';

type TextInputReact = {
  'aria-label'?: string;
  className: string;
  delayMs?: number;
  disabled?: boolean;
  /** specify 'decimal' to trigger numeric keyboards on mobile devices */
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  onBlur?: () => void;
  onChange: (s: string) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder: string;
  setValue?: (s: string) => void;
  value: string;
  inputValidator?: (s: string) => boolean;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputReact>(
  (
    {
      'aria-label': ariaLabel,
      className,
      delayMs = 0,
      disabled = false,
      onBlur,
      onChange,
      onFocus,
      placeholder,
      setValue,
      inputMode,
      value,
      inputValidator = () => true,
    },
    ref,
  ) => {
    const handleDebounce = useDebounce((value) => {
      onChange(value);
    }, delayMs);

    const handleChange = useCallback(
      (evt: ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;

        if (inputValidator(value)) {
          setValue?.(value);
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
        ref={ref}
        type="text"
        className={className}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onBlur={onBlur}
        onChange={handleChange}
        onFocus={onFocus}
        disabled={disabled}
        autoComplete="off" // autocomplete attribute handles browser autocomplete
        data-1p-ignore={true} // data-1p-ignore attribute handles password manager autocomplete
      />
    );
  },
);

TextInput.displayName = 'TextInput';
