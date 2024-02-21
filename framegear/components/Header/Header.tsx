import { APP_NAME } from '@/utils/constants';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export function Header() {
  return (
    <div className={`border-pallette-line flex w-full flex-col items-center gap-8 border-b py-8`}>
      <h1 className={`max-w-layout-max w-full`}>
        <AppName className="px-6 text-4xl" />
      </h1>
      <Banner />
    </div>
  );
}

function Banner() {
  return (
    <div
      className={`max-w-layout-max border-pallette-line bg-banner flex w-full items-center justify-between rounded-lg border p-6`}
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl">⚒️</div>
        <section className="flex flex-col gap-2">
          <h1 className="font-bold">This is a Frames debugger</h1>
          <p>
            Use <AppName /> to test out your Farcaster Frames and catch bugs!
          </p>
        </section>
      </div>
      <Link
        className="bg-link-button flex items-center gap-1 rounded-full px-4 py-2"
        href="https://docs.farcaster.xyz/reference/frames/spec"
      >
        <span>Farcaster Frames specs</span> <ArrowTopRightIcon />
      </Link>
    </div>
  );
}

function AppName({ className: additionalClasses = '' }: { className?: string }) {
  return (
    <span className={`rounded-lg bg-slate-800 p-1 font-mono ${additionalClasses}`}>{APP_NAME}</span>
  );
}
