import { background, icon } from '../../styles/theme';

export const cbwSvg = (width: number, height: number) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Wallet Icon</title>
    <rect width="1024" height="1024" fill="#0052FF" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M152 512C152 710.823 313.177 872 512 872C710.823 872 872 710.823 872 512C872 313.177 710.823 152 512 152C313.177 152 152 313.177 152 512ZM420 396C406.745 396 396 406.745 396 420V604C396 617.255 406.745 628 420 628H604C617.255 628 628 617.255 628 604V420C628 406.745 617.255 396 604 396H420Z"
      fill="white"
    />
  </svg>
);
