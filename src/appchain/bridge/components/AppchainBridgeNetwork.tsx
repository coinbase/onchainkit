'use client';
import { background, border, cn, text } from '@/styles/theme';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';

interface AppchainBridgeNetworkReact {
  type: 'from' | 'to';
  label: string;
}

export const AppchainBridgeNetwork = ({
  type,
  label,
}: AppchainBridgeNetworkReact) => {
  const { from, to } = useAppchainBridgeContext();

  const displayNetwork = type === 'from' ? from.name : to.name;
  const displayIcon = type === 'from' ? from.icon : to.icon;

  return (
    <div
      className={cn(
        background.secondary,
        border.radius,
        'box-border flex h-[80px] w-full flex-col items-start justify-center p-4',
      )}
      data-testid="ockAppchainBridgeNetwork_Container"
    >
      <div className="flex w-full items-center justify-between">
        <div
          className={cn(
            'flex-col items-center gap-2 p-3',
            border.radius,
            'w-full',
            {
              'items-start': type === 'from',
              'items-end': type === 'to',
            },
          )}
        >
          <div
            className={cn('flex w-full items-center', {
              'justify-start': type === 'from',
              'justify-end': type === 'to',
            })}
          >
            <span className={cn(text.label2, 'text-[#8A919E]')}>{label}</span>
          </div>
          <div
            className={cn('flex items-center gap-2', {
              'justify-start': type === 'from',
              'justify-end': type === 'to',
            })}
          >
            <div className="flex h-4 w-4 items-center justify-center">
              {displayIcon}
            </div>
            <span className={cn(text.headline)}>{displayNetwork}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
