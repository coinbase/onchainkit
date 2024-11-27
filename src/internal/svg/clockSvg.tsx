import { background, icon } from '../../styles/theme';

export const clockSvg = (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Clock Icon</title>
    <rect width="28" height="28" rx="8" className={background.default} />
    <path
      d="M14 20C17.3137 20 20 17.3137 20 14C20 10.6863 17.3137 8 14 8C10.6863 8 8 10.6863 8 14C8 17.3137 10.6863 20 14 20ZM13 10H14.5V13.5H17V15H13V10Z"
      className={icon.foreground}
    />
  </svg>
);
