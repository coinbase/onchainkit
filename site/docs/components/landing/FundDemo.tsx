import { FundButton } from '@coinbase/onchainkit/fund';
import App from '../App.tsx';

export const fundDemoCode = `
  import { FundButton, getOnrampBuyUrl } from '@coinbase/onchainkit/fund';
  import { useAccount } from 'wagmi';
  
  const projectId = 'YOUR_CDP_PROJECT_ID';
  const { address } = useAccount();
  
  const onrampBuyUrl = getOnrampBuyUrl({
    projectId,
    addresses: { address: ['base'] },
    assets: ['USDC'],
    presetFiatAmount: 20,
    fiatCurrency: 'USD'
  });

  <FundButton fundingUrl={onrampBuyUrl} />
`

function FundDemo() {
    return (
        <App>
            <FundButton />
        </App>
    )
}

export default FundDemo;