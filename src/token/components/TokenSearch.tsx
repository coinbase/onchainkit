import { useCallback, useState } from 'react';
import { TokenSearchReact } from '../types';
import { TextInput } from './TextInput';
import { useDebounce } from './useDebounce';

export function TokenSearch({ tokens, onSearch, delayMs = 200 }: TokenSearchReact) {
  const [value, setValue] = useState('');

  const handleDebounce = useDebounce((value) => {
    const result = tokens.filter(({ name, symbol, address }) => {
      const v = value.toLowerCase();
      return (
        name.toLowerCase().includes(v) ||
        symbol.toLowerCase().includes(v) ||
        address.toLowerCase().includes(v)
      );
    });
    onSearch(result);
  }, delayMs);

  const handleChange = useCallback((value: string) => {
    setValue(value);
    handleDebounce(value);
  }, []);

  return (
    <TextInput placeholder="Search name or paste address" value={value} onChange={handleChange} />
  );
}
