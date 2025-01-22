import { cn, text, color, background } from '@/styles/theme';
import { useCallback, useState } from 'react';
import { EarnCollateralizationParams } from '../types';

type ToggleSwitchParams = {
  isOn: boolean;
  onToggle: () => void;
};

function ToggleSwitch({ isOn, onToggle }: ToggleSwitchParams) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        `relative w-12 h-6 flex items-center rounded-full px-1  duration-300 `,
        background.alternate,
      )}
    >
      <div
        className={cn(
          `w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
            isOn ? 'translate-x-6' : ''
          }`,
        )}
      ></div>
    </button>
  );
}

export function EarnCollateralization({
  className,
}: EarnCollateralizationParams) {
  const [isOn, setIsOn] = useState(true);

  const handleToggle = useCallback(() => {
    setIsOn(!isOn);
  }, [isOn]);

  return (
    <div
      className={cn(
        'flex w-full justify-between items-center gap-4',
        className,
      )}
    >
      <div className={cn(text.label2, color.foregroundMuted)}>
        Collateralization
      </div>
      <ToggleSwitch isOn={isOn} onToggle={handleToggle} />
    </div>
  );
}
