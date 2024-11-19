import { useAccount } from 'wagmi';
import { TokenImage, type Token } from '../../token';
import { base } from 'viem/chains';
import { background, cn, color } from '../../styles/theme';

function TokenItem({ token }: { token: Token }) {
  return (
    <div className="flex">
      <TokenImage token={token} />
      <div className="flex flex-col">{token.name}</div>
    </div>
  );
}

export function FundSwapDropdown() {
  const { chainId } = useAccount();

  const ethToken: Token = {
    name: 'ETH',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image:
      'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    chainId: chainId || base.id,
  };

  const usdcToken: Token = {
    name: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDC',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
    chainId: chainId || base.id,
  };

  return (
    <div
      className={cn(
        color.foreground,
        background.alternate,
        'flex flex-col absolute translate-y-[110%] right-0  bottom-0 gap-4',
        'rounded p-4',
      )}
    >
      <div>Buy with</div>
      <TokenItem token={ethToken} />
      <TokenItem token={usdcToken} />
    </div>
  );
}
