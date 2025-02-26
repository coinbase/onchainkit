import {
  DepositAmountInput,
  DepositBalance,
  DepositButton,
  Earn,
  EarnDeposit as EarnDepositComponent,
  EarnDetails,
  useEarnContext,
} from '@coinbase/onchainkit/earn';
import App from './App.tsx';

const VAULT_ADDRESS = '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A';

export function EarnMain() {
  return (
    <App>
      <Earn vaultAddress={VAULT_ADDRESS} />
    </App>
  );
}

export function EarnDeposit() {
  return (
    <App>
      <Earn vaultAddress={VAULT_ADDRESS}>
        <div className="flex justify-center bg-[var(--ock-bg-primary)] py-2 text-[var(--ock-text-inverse)]">
          Custom header
        </div>
        <EarnDepositComponent />
        <div className="flex justify-center bg-[var(--ock-bg-primary)] py-2 text-[var(--ock-text-inverse)]">
          Custom footer
        </div>
      </Earn>
    </App>
  );
}

export function RearrangedEarnDeposit() {
  return (
    <App>
      <Earn vaultAddress={VAULT_ADDRESS}>
        <EarnDepositComponent>
          <EarnDetails />
          <DepositBalance />
          <DepositAmountInput className="border-2 border-green-400" />
          <DepositButton />
        </EarnDepositComponent>
      </Earn>
    </App>
  );
}

const predefinedAmounts = ['0.1', '1', '10'];

function CustomDepositInterface() {
  const { depositAmount, setDepositAmount } = useEarnContext();

  return (
    <EarnDepositComponent>
      <EarnDetails />
      <div className="grid grid-cols-3 gap-2">
        {predefinedAmounts.map((amount) => {
          const selected = amount === depositAmount;
          return (
            <button
              key={amount}
              type="button"
              onClick={() => setDepositAmount(amount)}
              className={`rounded-md px-4 py-2 ${selected ? 'bg-[var(--ock-bg-primary)] text-[var(--ock-text-inverse)]' : 'bg-[var(--ock-bg-secondary)] text-[var(--ock-text-primary)]'}`}
            >
              {amount}
            </button>
          );
        })}
      </div>
      <DepositButton />
    </EarnDepositComponent>
  );
}

export function PredefinedInputDeposit() {
  return (
    <App>
      <Earn vaultAddress={VAULT_ADDRESS}>
        <CustomDepositInterface />
      </Earn>
    </App>
  );
}
