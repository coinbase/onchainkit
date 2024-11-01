import { Link } from 'react-router-dom';
import AstroSvg from './svg/astroSvg.tsx';
import NextjsSvg from './svg/nextjsSvg.tsx';
import RemixSvg from './svg/remixSvg.tsx';
import ViteIcon from './svg/viteSvg.tsx';

export default function InstallationOptions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FrameworkCard
        name="Next.js"
        href="/installation/nextjs"
        icon={<NextjsSvg />}
      />
      <FrameworkCard
        name="Vite"
        href="/installation/vite"
        icon={<ViteIcon />}
      />
      <FrameworkCard
        name="Remix"
        href="/installation/remix"
        icon={<RemixSvg />}
      />
      <FrameworkCard
        name="Astro"
        href="/installation/astro"
        icon={<AstroSvg />}
      />
    </div>
  );
}

type FrameworkProps = {
  name: string;
  href: string;
  icon?: React.ReactNode;
};

function FrameworkCard({ name, href, icon }: FrameworkProps) {
  return (
    <Link
      to={href}
      className="m-2 rounded-md border-2 border-zinc-300 text-zinc-950 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
    >
      <div className="flex flex-col items-center gap-2 py-10 ">
        <div className="mb-2 h-10 w-10 text-white dark:text-black">{icon}</div>
        <span>{name}</span>
      </div>
    </Link>
  );
}
