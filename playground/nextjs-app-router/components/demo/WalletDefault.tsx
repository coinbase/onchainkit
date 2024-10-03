import { WalletDefault } from '@coinbase/onchainkit/wallet';

export default function WalletDemo() {
  return (
    <div className="mx-auto">
      <div className="flex justify-end">
        <WalletDefault />
      </div>
    </div>
  );
}
