import { CSSProperties, ChangeEvent, useCallback } from 'react';
import { SearchIcon } from './SearchIcon';

const styles = {
  container: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: '16px',
    top: '14px',
  },
  input: {
    borderRadius: '1000px',
    padding: '8px 20px 8px 48px',
    width: '100%',
    background: '#EEF0F3',
    color: '#5B616E',
  },
} as Record<string, CSSProperties>;

type TextInputReact = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export function TextInput({ placeholder, value, onChange }: TextInputReact) {
  const handleChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    onChange(evt.target.value);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.icon}>
        <SearchIcon />
      </div>
      <input
        type="text"
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
