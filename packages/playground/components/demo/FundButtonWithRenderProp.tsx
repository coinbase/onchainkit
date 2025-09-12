import { cn } from '@/lib/utils';
import {
  FundCard,
  FundCardAmountInput,
  FundCardAmountInputTypeSwitch,
  FundCardHeader,
  FundCardPaymentMethodDropdown,
  FundCardPresetAmountInputList,
  FundCardSubmitButton,
} from '@coinbase/onchainkit/fund';
import { pressable, text } from '@coinbase/onchainkit/theme';
import {
  FundButtonState,
  PresetAmountInputs,
} from '../../../onchainkit/dist/fund/types';

function Spinner() {
  return (
    <div
      className="flex h-full items-center justify-center"
      data-testid="ockSpinner"
    >
      <div
        className={cn(
          'animate-spin border-2 border-gray-200 border-t-3',
          'rounded-full border-t-gray-400 px-2.5 py-2.5',
        )}
      />
    </div>
  );
}

function customRender({
  status,
  onClick,
  isDisabled,
}: {
  status: FundButtonState;
  onClick: (e: React.MouseEvent) => void;
  isDisabled: boolean;
}) {
  const classNames = cn(
    'w-full',
    'bg-purple-500',
    'px-4 py-3 inline-flex items-center justify-center space-x-2 rounded-ock-default text-ock-foreground-inverse',
    {
      [pressable.disabled]: isDisabled,
    },
    text.headline,
  );

  let buttonContent = <span>Click to fund</span>;

  if (status === 'loading') {
    buttonContent = <Spinner />;
  }

  if (status === 'success') {
    buttonContent = <span>Success</span>;
  }

  if (status === 'error') {
    buttonContent = <span>Something went wrong</span>;
  }

  return (
    <button className={classNames} onClick={onClick} disabled={isDisabled}>
      {buttonContent}
    </button>
  );
}

const presetAmountInputs: PresetAmountInputs = ['10', '20', '100'];

export default function FundButtonWithRenderPropDemo() {
  return (
    <div className="mx-auto grid w-1/2 gap-8">
      <FundCard
        assetSymbol="ETH"
        country="US"
        currency="USD"
        presetAmountInputs={presetAmountInputs}
        onError={(error) => {
          console.log('FundCard onError', error);
        }}
        onStatus={(status) => {
          console.log('FundCard onStatus', status);
        }}
        onSuccess={() => {
          console.log('FundCard onSuccess');
        }}
      >
        <FundCardHeader />
        <FundCardAmountInput />
        <FundCardAmountInputTypeSwitch />
        <FundCardPresetAmountInputList />
        <FundCardPaymentMethodDropdown />
        <FundCardSubmitButton render={customRender} />
      </FundCard>
    </div>
  );
}
