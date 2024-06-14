import { useCallback } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useDebounce } from './useDebounce';

type TextInputReact = {
  className: string;
  delayMs: number;
  onChange: (value: string) => void;
  placeholder: string;
  setValue: Dispatch<SetStateAction<string>>;
  value: string;
};

export function TextInput({
  className,
  delayMs,
  onChange,
  placeholder,
  setValue,
  value,
}: TextInputReact) {
  const handleDebounce = useDebounce((value) => {
    onChange(value);
  }, delayMs);

  const handleChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const value = evt.target.value;
      setValue(value);

      if (delayMs > 0) {
        handleDebounce(value);
      } else {
        onChange(value);
      }
    },
    [onChange, handleDebounce, delayMs, setValue],
  );

  return (
    <input
      data-testid="ockTextInput_Search"
      type="text"
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  );
}
