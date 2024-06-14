import { type ChangeEvent, useCallback } from 'react';
import { SearchIcon } from './SearchIcon';

type TextInputReact = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export function TextInput({ placeholder, value, onChange }: TextInputReact) {
  const handleChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      onChange(evt.target.value);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <div className="relative flex items-center">
      <div className="-translate-y-1/2 absolute top-1/2 left-4">
        <SearchIcon />
      </div>
      <input
        data-testid="ockTextInput_Search"
        type="text"
        className="w-full rounded-full border-2 border-[#eef0f3] border-solid bg-[#eef0f3] py-2 pr-5 pl-12 text-[#0A0B0D] placeholder-[#5B616E] outline-none hover:bg-[#cacbce] hover:focus:bg-[#eef0f3]"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
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
