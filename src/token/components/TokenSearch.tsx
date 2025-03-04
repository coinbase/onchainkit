'use client';

import { useCallback, useState } from 'react';
import { TextInput } from '../../internal/components/TextInput';
import { useTheme } from '../../internal/hooks/useTheme';
import { CloseSvg } from '../../internal/svg/closeSvg';
import { searchIconSvg } from '../../internal/svg/searchIconSvg';
import { cn, color, placeholder, pressable } from '../../styles/theme';
import type { TokenSearchReact } from '../types';

export function TokenSearch({
  className,
  onChange,
  delayMs = 200,
}: TokenSearchReact) {
  const componentTheme = useTheme();

  const [value, setValue] = useState('');

  const handleClear = useCallback(() => {
    setValue('');
    onChange('');
  }, [onChange]);

  return (
    <div className="relative flex items-center">
      <div className="-translate-y-1/2 absolute top-1/2 left-4">
        {searchIconSvg}
      </div>
      <TextInput
        className={cn(
          componentTheme,
          pressable.alternate,
          color.foreground,
          placeholder.default,
          'w-full rounded-xl py-2 pr-5 pl-12 outline-none',
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
          <CloseSvg />
        </button>
      )}
    </div>
  );
}
