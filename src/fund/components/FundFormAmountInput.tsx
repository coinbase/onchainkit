import {
  type ChangeEvent,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { border, cn, text } from '../../styles/theme';
import { useTheme } from '../../useTheme';
import { useFundContext } from './FundProvider';
import { FundButton } from './FundButton';
import { FundCardHeader } from './FundCardHeader';
import { PaymentMethodSelectorDropdown } from './PaymentMethodSelectorDropdown';

type Props = {
  value: string;
  setValue: (s: string) => void;
  currencySign?: string;
};

export const FundFormAmountInput = ({
  value,
  setValue,
  currencySign,
}: Props) => {
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
      return 60;
    }
    return 60 - Math.min(value.length * 2.5, 40);
  }, [value]);

  // useEffect(() => {
  //   // Update the input width based on the hidden span's width
  //   if (spanRef.current && inputRef.current) {
  //     if (inputRef.current?.style?.width) {
  //       inputRef.current.style.width =
  //         value.length === 1
  //           ? `${spanRef.current?.offsetWidth}px`
  //           : `${spanRef.current?.offsetWidth + 10}px`;
  //     }
  //   }
  // }, [value]);

  return (
    <div className="flex py-6">
      {currencySign && (
        <span
          className={cn(
            componentTheme,
            'flex items-center justify-center bg-transparent font-display text-[60px]',
            'leading-none outline-none'
          )}
        >
          {currencySign}
        </span>
      )}
      <input
        className={cn(
          componentTheme,
          'w-[100%] border-[none] bg-transparent font-display text-[60px]',
          'leading-none outline-none'
        )}
        type="text"
        value={value}
        onChange={handleChange}
        ref={inputRef}
        style={{
          // maxWidth: '380px',
          //fontSize: '60px',//`${fontSize}px`,
          // width: '55px',
          //boxSizing: 'content-box',
          // transition: 'width 0.2s ease',
          //margin: '0',
        }}
        placeholder="0"
      />
      {/* Hidden span to measure content width */}
      {/* <span
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
      </span> */}
    </div>
  );
};

export default FundFormAmountInput;
