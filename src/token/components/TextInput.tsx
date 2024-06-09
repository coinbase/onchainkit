import { ChangeEvent, useCallback } from 'react';
import { SearchIcon } from './SearchIcon';

type TextInputReact = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export function TextInput({ placeholder, value, onChange }: TextInputReact) {
  const handleChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    onChange(evt.target.value);
  }, []);

  const handleClear = useCallback(() => {
    onChange('');
  }, []);

  return (
    <div className="relative flex items-center">
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <SearchIcon />
      </div>
      <input
        data-testid="ockTextInput_Search"
        type="text"
        className="w-full rounded-full border-2 border-solid border-[#eef0f3] bg-[#eef0f3] py-2 pl-12 pr-5 text-[#0A0B0D] placeholder-[#5B616E] outline-none hover:bg-[#cacbce] hover:focus:bg-[#eef0f3]"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {value && (
        <button
          data-testid="ockTextInput_Clear"
          className="absolute right-4 top-1/2 -translate-y-1/2"
          onClick={handleClear}
        >
          <svg
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
