import { useCallback, useState } from 'react';
import { TokenSearchReact } from '../types';
import { TextInput } from './TextInput';
import { useDebounce } from './useDebounce';

export function TokenSearch({ onChange, delayMs = 200 }: TokenSearchReact) {
  const [value, setValue] = useState('');

  const handleDebounce = useDebounce((value) => {
    onChange(value);
  }, delayMs);

  const handleChange = useCallback((value: string) => {
    setValue(value);

    if (delayMs > 0) {
      handleDebounce(value);
    } else {
      onChange(value);
    }
  }, []);

  return <TextInput placeholder="Search for a token" value={value} onChange={handleChange} />;
}
