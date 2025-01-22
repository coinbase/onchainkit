import { background, border, cn, color, text } from '@/styles/theme';
import { EarnTabsReact } from '../types';
import { useEarnContext } from './EarnProvider';

function EarnTab({
  title,
  isSelected,
  onTabClick,
}: {
  title: string;
  isSelected: boolean;
  onTabClick: (tab: string) => void;
}) {
  return (
    <div
      className={cn(
        text.label1,
        isSelected ? color.primary : color.foreground,
        isSelected ? background.washed : background.default,
        'w-[50%] text-center border-b-none border-r',
        'cursor-pointer px-3 py-4',
      )}
      onClick={() => onTabClick(title)}
    >
      {title}
    </div>
  );
}

export function EarnTabs({ className }: EarnTabsReact) {
  const { selectedTab, setSelectedTab } = useEarnContext();

  return (
    <div className={cn('flex overflow-hidden', className)}>
      <EarnTab
        onTabClick={setSelectedTab}
        title="Deposit"
        isSelected={selectedTab === 'Deposit'}
      />
      <EarnTab
        onTabClick={setSelectedTab}
        title="Withdraw"
        isSelected={selectedTab === 'Withdraw'}
      />
    </div>
  );
}
