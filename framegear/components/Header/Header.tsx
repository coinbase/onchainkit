import { APP_NAME } from '@/utils/constants';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export function Header() {
  return (
    <div className={`border-pallette-line flex w-full justify-center border-b py-8`}>
      <div className="max-w-layout-max flex w-full items-center justify-between">
        <h1>
          <AppName className="px-6 text-4xl" />
        </h1>
        <Link
          className="bg-content-light dark:bg-link-button flex items-center gap-1 rounded-full px-4 py-2"
          href="https://docs.farcaster.xyz/reference/frames/spec"
          target="_blank"
        >
          <span>Farcaster Frames specs</span> <ArrowTopRightIcon />
        </Link>
      </div>
    </div>
  );
}

function AppName({ className: additionalClasses = '' }: { className?: string }) {
  return (
    <span
      className={`bg-content-light rounded-lg p-1 font-mono dark:bg-slate-800 ${additionalClasses}`}
    >
      {APP_NAME}
    </span>
  );
}
