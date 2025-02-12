import { useCallback, useState } from 'react';
import { TextInput } from '../../internal/components/TextInput';
import { background, border, cn, color, pressable } from '../../styles/theme';

export const DELAY_MS = 200;

type QuantitySelectorReact = {
  className?: string;
  disabled?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
  onChange: (s: string) => void;
  placeholder: string;
};

export function QuantitySelector({
  className,
  disabled,
  minQuantity = 1,
  maxQuantity = Number.MAX_SAFE_INTEGER,
  onChange,
  placeholder,
}: QuantitySelectorReact) {
  const [value, setValue] = useState(`${minQuantity}`);

  // allow entering '' to enable backspace + new value, fix empty string on blur
  const isValidQuantity = useCallback(
    (v: string) => {
      if (Number.parseInt(v, 10) < minQuantity) {
        return false;
      }

      if (Number.parseInt(v, 10) > maxQuantity) {
        return false;
      }
      // only numbers are valid
      const regex = /^[0-9]*$/;
      return regex.test(v);
    },
    [maxQuantity, minQuantity],
  );

  const handleIncrement = useCallback(() => {
    const next = `${Math.min(maxQuantity, Number.parseInt(value, 10) + 1)}`;
    setValue(next);
    onChange(next);
  }, [onChange, maxQuantity, value]);

  const handleDecrement = useCallback(() => {
    const next = `${Math.max(minQuantity, Number.parseInt(value, 10) - 1)}`;
    setValue(next);
    onChange(next);
  }, [onChange, minQuantity, value]);

  const handleOnChange = useCallback(
    (v: string) => {
      if (v === '') {
        return;
      }

      onChange(v);
    },
    [onChange],
  );

  const handleBlur = useCallback(() => {
    if (value === '') {
      setValue(minQuantity.toString());
      onChange(minQuantity.toString());
    }
  }, [onChange, minQuantity, value]);

  const classNames = cn(
    'h-11 w-11 rounded-lg border',
    border.defaultActive,
    color.foreground,
    background.default,
    disabled && pressable.disabled,
  );

  return (
    <div
      className={cn('relative flex items-center gap-1', className)}
      data-testid="ockQuantitySelector"
    >
      <div>
        <button
          aria-label="decrement"
          className={cn(classNames, pressable.default)}
          data-testid="ockQuantitySelector_decrement"
          disabled={disabled}
          onClick={handleDecrement}
          type="button"
        >
          -
        </button>
      </div>
      <TextInput
        aria-label="quantity"
        className={cn(
          classNames,
          'w-full text-center hover:bg-[var(--ock-bg-default-hover)] focus:bg-transparent',
        )}
        delayMs={DELAY_MS}
        disabled={disabled}
        inputValidator={isValidQuantity}
        onBlur={handleBlur}
        onChange={handleOnChange}
        placeholder={placeholder}
        setValue={setValue}
        value={value}
      />
      <div>
        <button
          aria-label="increment"
          className={cn(classNames, pressable.default)}
          data-testid="ockQuantitySelector_increment"
          disabled={disabled}
          onClick={handleIncrement}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
}
