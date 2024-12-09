import { AppContext } from '@/components/AppProvider';
import { cn } from '@/lib/utils';
import { WalletIslandDefault } from '@coinbase/onchainkit/wallet';
import { useContext } from 'react';

const anchorPositionToClassMap = {
  'top-left': 'justify-start self-start',
  'top-center': 'justify-start self-center',
  'top-right': 'justify-start self-end',
  'bottom-left': 'justify-end self-start',
  'bottom-center': 'justify-end self-center',
  'bottom-right': 'justify-end self-end',
};

export default function WalletIslandDefaultDemo() {
  const { anchorPosition } = useContext(AppContext);

  const anchorPositionClass = anchorPosition
    ? anchorPositionToClassMap[
        anchorPosition as keyof typeof anchorPositionToClassMap
      ]
    : '';

  return (
    <div className={cn('my-20', anchorPositionClass)}>
      <WalletIslandDefault />
    </div>
  );
}
