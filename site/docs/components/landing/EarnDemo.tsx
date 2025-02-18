import {
  DepositAmountInput,
  DepositBalance,
  DepositButton,
  Earn,
  EarnDeposit,
  EarnDetails,
} from '@coinbase/onchainkit/earn';
import App from '../App.tsx';

export const earnDemoCode = `
  import { Earn } from '@coinbase/onchainkit/earn';
  import App from '../App.tsx';

  function EarnDemo() {
    return (
      <App>
        <Earn vaultAddress="0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A" />
      </App>
    );
  }
`;

function EarnDemo() {
  return (
    <App>
      <Earn vaultAddress="0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A">
        <EarnDeposit>
          <EarnDetails />
          <DepositAmountInput />
          <DepositBalance />
          <DepositButton disabled={true} />
        </EarnDeposit>
      </Earn>
    </App>
  );
}

export default EarnDemo;
