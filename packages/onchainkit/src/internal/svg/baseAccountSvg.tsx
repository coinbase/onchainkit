import { useOnchainKit } from '@/useOnchainKit';
import { usePreferredColorScheme } from '../hooks/usePreferredColorScheme';

export function BaseAccountSvg() {
  const preferredMode = usePreferredColorScheme();
  const config = useOnchainKit();
  const mode = config.config?.appearance?.mode;
  const isDarkMode =
    mode === 'dark' || (mode === 'auto' && preferredMode === 'dark');

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      aria-label="Base Account logo"
    >
      <title>Base Account logo</title>
      <path
        fill={isDarkMode ? '#FFF' : '#00F'}
        d="M0 2.014c0-.433 0-.65.082-.816A.8.8 0 0 1 .448.832C.615.75.831.75 1.264.75h13.472c.433 0 .65 0 .816.082a.8.8 0 0 1 .366.366c.082.167.082.383.082.816v13.472c0 .433 0 .65-.082.816a.8.8 0 0 1-.366.366c-.167.082-.383.082-.816.082H1.264c-.433 0-.65 0-.816-.082a.8.8 0 0 1-.366-.366C0 16.135 0 15.919 0 15.486V2.014Z"
      />
    </svg>
  );
}
