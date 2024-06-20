import { useCallback, useState } from 'react';
import type { TokenSearchReact } from '../types';
import { SearchIcon } from './SearchIcon';
import { TextInput } from '../../internal/form/TextInput';
import { cn, color, pressable, text } from '../../styles/theme';

export function TokenSearch({
  className,
  onChange,
  delayMs = 200,
}: TokenSearchReact) {
  const [value, setValue] = useState('');

  const handleClear = useCallback(() => {
    setValue('');
    onChange('');
  }, [onChange]);

  return (
    <div className="relative flex items-center">
      <div className="-translate-y-1/2 absolute top-1/2 left-4">
        <SearchIcon />
      </div>
      <TextInput
        className={cn(
          pressable.alternate,
          color.foreground,
          'w-full rounded-xl border-2 border-[#eef0f3] border-solid py-2 pr-5 pl-12 placeholder-[#5B616E] outline-none',
          className,
        )}
        placeholder="Search for a token"
        value={value}
        setValue={setValue}
        onChange={onChange}
        delayMs={delayMs}
      />
      {value && (
        <button
          type="button"
          data-testid="ockTextInput_Clear"
          className="-translate-y-1/2 absolute top-1/2 right-4"
          onClick={handleClear}
        >
          <svg
            role="img"
            aria-label="ock-close-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.3352 1L1 2.33521L6.66479 8L1 13.6648L2.3352 15L8 9.33521L13.6648 15L15 13.6648L9.33521 8L15 2.33521L13.6648 1L8 6.6648L2.3352 1Z"
              fill="#0A0B0D"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
