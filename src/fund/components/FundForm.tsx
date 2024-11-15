import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { border, cn, color, line, pressable, text } from '../../styles/theme';
import { useTheme } from '../../useTheme';
import { useFundContext } from './FundProvider';
import { FundButton } from './FundButton';
import { TextInput } from '../../internal/components/TextInput';
import { formatAmount } from '../../token/utils/formatAmount';

type Props = {
  assetSymbol: string;
  placeholder?: string | React.ReactNode;
  headerText?: string;
  buttonText?: string;
};
export function FundForm({
  assetSymbol,
  buttonText = 'Buy',
  headerText,
}: Props) {
  const componentTheme = useTheme();

  const { setSelectedAsset, setFundAmount, fundAmount } = useFundContext();

  const defaultHeaderText = `Buy ${assetSymbol.toUpperCase()}`;
  return (
    <form
      className={cn(
        componentTheme,
        'flex w-[440px] flex-col items-center justify-center p-3',
        text.headline,
        border.radius,
        line.heavy
      )}
    >
      <div
        className={cn(
          componentTheme,
          'font-display text-[16px]',
          'leading-none outline-none'
        )}
      >
        {headerText || defaultHeaderText}
      </div>

      <div className="flex h-[106px] items-center justify-center">
        <ResizableInput
          value={fundAmount}
          setValue={setFundAmount}
          currencySign="$"
        />
      </div>
      <FundButton text={buttonText} />
    </form>
  );
}

type ResizableInputProps = {
  value: string;
  setValue: (s: string) => void;
  currencySign?: string;
};

const ResizableInput = ({
  value,
  setValue,
  currencySign,
}: ResizableInputProps) => {
  const componentTheme = useTheme();

  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const previousValueRef = useRef<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    /**
     * Only allow numbers to be entered into the input
     * Using type="number" on the input does not work because it adds a spinner which does not get removed with css '-webkit-appearance': 'none'
     */
    if (/^\d*\.?\d*$/.test(value)) {
      if (value.length === 1 && value === '.') {
        value = '0.';
      } else if (value.length === 1 && value === '0') {
        if (previousValueRef.current.length <= value.length) {
          // Add a dot if the user types a single zero
          value = '0.';
        } else {
          value = '';
        }
      } else if (
        value[value.length - 1] === '.' &&
        previousValueRef.current.length >= value.length
      ) {
        // If we are deleting a character and the last character is a dot, remove it
        value = value.slice(0, -1);
      } else if (value.length === 2 && value[0] === '0' && value[1] !== '.') {
        // Add a dot in case there is a leading zero
        value = `${value[0]}.${value[1]}`;
      }

      setValue(value);
    }
    // Update the previous value
    previousValueRef.current = value;
  };

  const fontSize = useMemo(() => {
    if (value.length < 2) {
      return 80;
    }
    return 80 - Math.min(value.length * 2.5, 60);
  }, [value]);

  useEffect(() => {
    // Update the input width based on the hidden span's width
    if (spanRef.current && inputRef.current) {
      if (inputRef.current?.style?.width) {
        inputRef.current.style.width =
          value.length === 1
            ? `${spanRef.current?.offsetWidth}px`
            : `${spanRef.current?.offsetWidth + 10}px`;
      }
    }
  }, [value]);

  return (
    <div className="flex-inline items-center">
      {currencySign && (
        <span
          className={cn(
            componentTheme,
            'bg-transparent font-display text-[80px]',
            'leading-none outline-none'
          )}
          style={{
            fontSize: `${fontSize}px`,
          }}
        >
          {currencySign}
        </span>
      )}
      <input
        className={cn(
          componentTheme,
          'border-[none] bg-transparent font-display',
          'leading-none outline-none'
        )}
        type="text"
        value={value}
        onChange={handleChange}
        ref={inputRef}
        style={{
          maxWidth: '380px',
          fontSize: `${fontSize}px`,
          width: '55px',
          boxSizing: 'content-box',
          transition: 'width 0.2s ease',
          margin: '0',
        }}
        placeholder="0"
      />
      {/* Hidden span to measure content width */}
      <span
        ref={spanRef}
        style={{
          maxWidth: '380px',
          visibility: 'hidden',
          position: 'absolute',
          whiteSpace: 'nowrap',
          fontSize: `${fontSize}px`,
          pointerEvents: 'none',
        }}
      >
        {value || '0'}
      </span>
    </div>
  );
};

export default ResizableInput;
