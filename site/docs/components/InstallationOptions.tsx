import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/Theme.tsx';
import { Icon } from './Icon.tsx';

export default function InstallationOptions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FrameworkCard name="Vite" href="/installation/vite" />
      <FrameworkCard name="Remix" href="/installation/remix" />
      <FrameworkCard name="Astro" href="/installation/astro" />
    </div>
  );
}

type FrameworkProps = {
  name: string;
  href: string;
};

function FrameworkCard({ name, href }: FrameworkProps) {
  const { theme } = useTheme();
  return (
    <Link
      to={href}
      className="m-2 rounded-md border-2 border-zinc-300 text-zinc-950 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
    >
      <div className="flex flex-col items-center gap-2 py-10">
        <Icon
          name={name.toLowerCase()}
          color={theme === 'dark' ? 'white' : 'black'}
          width="40"
          height="40"
        />
        <span>{name}</span>
      </div>
    </Link>
  );
}
