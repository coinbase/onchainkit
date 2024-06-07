import { APP_NAME } from '@/utils/constants';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export function Header() {
  return (
    <div className="flex w-full justify-center border-pallette-line border-b py-8">
      <div className="flex w-full max-w-layout-max items-center justify-between">
        <h1>
          <AppName className="px-6 text-4xl" />
        </h1>
        <Link
          className="flex items-center gap-1 rounded-full bg-content-light px-4 py-2 dark:bg-link-button"
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
      className={`rounded-lg bg-content-light p-1 font-mono dark:bg-slate-800 ${additionalClasses}`}
    >
      {APP_NAME}
    </span>
  );
}
