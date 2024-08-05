import { frameSvg } from '../svg/frameSvg.tsx';
import { identitySvg } from '../svg/identitySvg.tsx';
import { swapSvg } from '../svg/swapSvg.tsx';
import { tokensSvg } from '../svg/tokensSvg.tsx';
import { transactionSvg } from '../svg/transactionSvg.tsx';
import { walletSvg } from '../svg/walletSvg.tsx';

const navItems = [
  {
    href: '#identity',
    svg: identitySvg,
    label: 'Identity',
  },
  {
    href: '#wallet',
    svg: walletSvg,
    label: 'Wallet',
  },
  {
    href: '#tokens',
    svg: tokensSvg,
    label: 'Tokens',
  },
  {
    href: '#swap',
    svg: swapSvg,
    label: 'Swap',
  },
  {
    href: '#transaction',
    svg: transactionSvg,
    label: 'Transaction',
  },
  {
    href: '#frame',
    svg: frameSvg,
    label: 'Frame',
  },
];

export default function NavigationList() {
  return (
    <ul className='flex max-w-full flex-wrap justify-center gap-12 md:justify-end'>
      {navItems.map((item) => {
        return (
          <li key={item?.label}>
            <a
              href={item.href}
              className='group flex flex-col items-center gap-3'
            >
              <div className='h-[70px] w-[70px] rounded-xl bg-gray-800 p-5 group-hover:bg-gray-50'>
                {item.svg}
              </div>
              <p className='text-center font-normal text-base not-italic leading-6'>
                {item.label}
              </p>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
