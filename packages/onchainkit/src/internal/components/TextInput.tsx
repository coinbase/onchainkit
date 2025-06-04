import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type ForwardedRef,
  type ComponentProps,
  useCallback,
  forwardRef,
} from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { cn } from '@/styles/theme';

type TextInputProps = Omit<ComponentProps<'input'>, 'onChange'> & {
  delayMs?: number;
  /** specify 'decimal' to trigger numeric keyboards on mobile devices */
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  onChange: (s: string) => void;
  placeholder: string;
  setValue?: (s: string) => void;
  inputValidator?: (s: string) => boolean;
  /** specify 'error' to show error state (change in color), field is used for a11y purposes, not actually rendered currently, can be either boolean flag or string error message */
  error?: string | boolean;
};

export const TextInput = forwardRef(
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
      error,
      ...rest
    }: TextInputProps,
    ref: ForwardedRef<HTMLInputElement>,
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
        data-testid="ockTextInput_Input"
        aria-invalid={!!error}
        aria-label={ariaLabel}
        ref={ref}
        type="text"
        className={cn(className, !!error && 'text-ock-text-error')}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onBlur={onBlur}
        onChange={handleChange}
        onFocus={onFocus}
        disabled={disabled}
        autoComplete="off" // autocomplete attribute handles browser autocomplete
        data-1p-ignore={true} // data-1p-ignore attribute handles password manager autocomplete
        {...rest}
      />
    );
  },
);

TextInput.displayName = 'TextInput';
