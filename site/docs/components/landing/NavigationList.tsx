import { fundSvg } from '../svg/fundSvg.tsx';
import { identitySvg } from '../svg/identitySvg.tsx';
import { swapSvg } from '../svg/swapSvg.tsx';
import { transactionSvg } from '../svg/transactionSvg.tsx';
import { walletSvg } from '../svg/walletSvg.tsx';

// The order is based on the most popular items from Google Analytics
const navItems = [
  {
    href: '#wallet',
    svg: walletSvg,
    label: 'Wallet',
  },
  {
    href: '#transaction',
    svg: transactionSvg,
    label: 'Transaction',
  },
  {
    href: '#swap',
    svg: swapSvg,
    label: 'Swap',
  },
  {
    href: '#fund',
    svg: fundSvg,
    label: 'Fund',
  },
  {
    href: '#identity',
    svg: identitySvg,
    label: 'Identity',
  },
];

export default function NavigationList() {
  return (
    <ul className="flex max-w-full flex-wrap justify-center gap-12 md:justify-end">
      {navItems.map((item) => {
        return (
          <li key={item?.label}>
            <a
              href={item.href}
              className="group flex flex-col items-center gap-3"
            >
              <div className="h-[70px] w-[70px] rounded-xl bg-gray-200 p-5 group-hover:bg-gray-300 dark:bg-gray-800 dark:group-hover:bg-gray-700">
                {item.svg}
              </div>
              <p className="text-center font-normal text-base text-gray-950 not-italic leading-6 dark:text-gray-50">
                {item.label}
              </p>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
