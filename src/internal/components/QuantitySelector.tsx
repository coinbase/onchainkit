import { useCallback, useState } from 'react';
import { TextInput } from '../../internal/components/TextInput';
import { background, border, cn, color, pressable } from '../../styles/theme';
import { isValidAmount } from '../utils/isValidAmount';

type QuantitySelectorReact = {
  className?: string;
  defaultValue: string;
  disabled?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
  onChange: (s: string) => void;
  placeholder: string;
};

export function QuantitySelector({
  className,
  defaultValue,
  disabled,
  minQuantity = 1,
  maxQuantity = Number.MAX_SAFE_INTEGER,
  onChange,
  placeholder,
}: QuantitySelectorReact) {
  const [value, setValue] = useState(defaultValue);

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

  const handleBlur = useCallback(() => {
    if (value === '' || Number.parseInt(value, 10) < minQuantity) {
      setValue(minQuantity.toString());
    }

    if (Number.parseInt(value, 10) > maxQuantity) {
      setValue(maxQuantity.toString());
    }
  }, [value, maxQuantity, minQuantity])

  const classNames = cn(
    'h-11 w-11 rounded-lg border', 
    border.defaultActive, 
    color.foreground, 
    background.default,
    disabled && pressable.disabled
  );

  return (
    <div 
      className={cn("relative flex items-center gap-1", className)} 
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
        className={cn(classNames, 'w-full text-center')}
        delayMs={200}
        disabled={disabled}
        inputValidator={isValidAmount}
        onBlur={handleBlur}
        onChange={onChange}
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
