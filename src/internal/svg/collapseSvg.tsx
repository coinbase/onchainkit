import { background, icon } from '../../styles/theme';

export const collapseSvg = (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Collapse</title>
    <rect width="28" height="28" rx="8" className={background.default} />
    <path
      d="M15.86 11.37L19.11 8L20 8.89L16.74 12.25H19.11V13.5H14.61V8.99998H15.86V11.37Z"
      className={icon.foreground}
    />
    <path
      d="M12.25 16.7399L8.89 19.9999L8 19.1099L11.37 15.8599L9 15.8599L9 14.6099L13.5 14.6099L13.5 19.1099H12.25V16.7399Z"
      className={icon.foreground}
    />
  </svg>
);
