import { FundButton } from '@coinbase/onchainkit/fund';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import App from '../App.tsx';
import FundWrapper from '../FundWrapper.tsx';

export const fundDemoCode = `
  import { useAccount } from 'wagmi';
  import {
    FundButton,
    getOnrampBuyUrl
  } from '@coinbase/onchainkit/fund';
  import { WalletDefault } from '@coinbase/onchainkit/wallet';

  function FundDemo() {
    const projectId = 'YOUR_CDP_PROJECT_ID';
    const { address } = useAccount();

    const onrampBuyUrl = getOnrampBuyUrl({
      projectId,
      addresses: { [address]: ['base'] },
      assets: ['USDC'],
      presetFiatAmount: 20,
      fiatCurrency: 'USD'
    });

    return (
      <>
        {address ? (
          <FundButton fundingUrl={onrampBuyUrl} />
        ) : (
          <WalletDefault />
        )}
      </>
    )
  }
  `;

function FundDemo() {
  return (
    <App>
      <FundWrapper>
        {({ address }) => {
          if (address) {
            return (
              <FundButton
                text={'Fund'}
                hideIcon={false}
                className="w-[180px]"
              />
            );
          }
          return (
            <>
              <Wallet>
                <ConnectWallet>
                  <Avatar className="h-6 w-6" />
                  <Name />
                </ConnectWallet>
              </Wallet>
            </>
          );
        }}
      </FundWrapper>
    </App>
  );
}

export default FundDemo;
