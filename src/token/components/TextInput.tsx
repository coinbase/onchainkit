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
    <div className="ock-textinput-container">
      <div className="ock-textinput-iconsearch">
        <SearchIcon />
      </div>
      <input
        data-testid="ockTextInput_Search"
        type="text"
        className="ock-textinput-input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {value && (
        <button className="ock-textinput-clearbutton" onClick={handleClear}>
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
