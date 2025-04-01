import { background, icon } from '../../styles/theme';

export const qrIconSvg = (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>QR Code</title>
    <rect width="28" height="28" rx="8" className={background.default} />
    <path d="M10 10H11.5V11.5H10V10Z" className={icon.foreground} />
    <path
      d="M8 13.5H13.5V8H8V13.5ZM9.25 9.25H12.25V12.25H9.25V9.25Z"
      className={icon.foreground}
    />
    <path d="M18 10H16.5V11.5H18V10Z" className={icon.foreground} />
    <path
      d="M14.5 8V13.5H20V8H14.5ZM18.75 12.25H15.75V9.25H18.75V12.25Z"
      className={icon.foreground}
    />
    <path d="M10 16.5H11.5V18H10V16.5Z" className={icon.foreground} />
    <path
      d="M8 20H13.5V14.5H8V20ZM9.25 15.75H12.25V18.75H9.25V15.75Z"
      className={icon.foreground}
    />
    <path
      d="M18 16.75H18.75V14.5H20V18H16.75V15.75H15.75V20H14.5V14.5H18V16.75Z"
      className={icon.foreground}
    />
    <path d="M18 18.75H16.75V20H18V18.75Z" className={icon.foreground} />
    <path d="M18.75 18.75H20V20H18.75V18.75Z" className={icon.foreground} />
  </svg>
);
