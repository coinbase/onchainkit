import { cn, pressable, text } from '../../styles/theme';
import { walletSvg } from './walletSvg';

export function GoToWalletDashboard() {
  return (
    <a
      className={cn(pressable.default, 'flex items-center gap-2 px-4 py-2')}
      target="_blank"
      href="https://wallet.coinbase.com"
      rel="noreferrer"
    >
      <div className="w-5">{walletSvg}</div>
      <span className={cn(text.body, 'shrink-0')}>Go to Wallet Dashboard</span>
    </a>
  );
}
