import { icon } from '../../styles/theme';

type CloseSvgProps = {
  className?: string;
};

export function CloseSvg({ className = icon.foreground }: CloseSvgProps) {
  return (
    <svg
      aria-label="ock-closeSvg"
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Close</title>
      <path d="M2.14921 1L1 2.1492L6.8508 8L1 13.8508L2.1492 15L8 9.1492L13.8508 15L15 13.8508L9.14921 8L15 2.1492L13.8508 1L8 6.8508L2.14921 1Z" />
    </svg>
  );
}
