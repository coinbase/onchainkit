import React from 'react';
import { cn } from '../../styles/theme';
import type { SlippageInputReact } from '../types';
import { useState } from 'react';

export function SlippageInput({
  className,
  defaultSlippage = '0.5',
  slippageMode,
}: SlippageInputReact) {
  const [customSlippage, setCustomSlippage] = useState(defaultSlippage);

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border border-gray-300 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-950',
        className,
      )}
    >
      <input
        type="text"
        value={customSlippage}
        onChange={(e) => setCustomSlippage(e.target.value)}
        className="w-12 bg-transparent pl-1 font-normal font-sans text-gray-900 text-sm leading-6 focus:outline-none dark:text-gray-50"
        disabled={slippageMode === 'Auto'}
      />
      <span className="ml-1 font-normal font-sans text-gray-400 text-sm leading-6 dark:bg-gray-950 dark:text-gray-50">
        %
      </span>
    </div>
  );
}
