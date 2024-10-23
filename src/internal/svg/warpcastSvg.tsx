import { icon } from '../../styles/theme';

export const warpcastSvg = (
  <svg
    data-testid="ock-warpcastSvg"
    role="img"
    aria-label="ock-warpcastSvg"
    width="100%"
    height="100%"
    viewBox="0 0 19 19"
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full"
  >
    <rect width="19" height="19" className={icon.foreground} />
    <g transform="translate(19,0) scale(-0.1,0.1)">
      <path
        d="M12 178 c-16 -16 -16 -150 0 -166 16 -16 150 -16 166 0 16 16 16 150 0 166 -16 16 -150 16 -166 0z m59 -65 c1 -17 2 -17 6 0 6 22 33 22 34 0 1 -17 2 -17 6 0 2 9 10 17 18 17 10 0 11 -8 3 -40 -11 -43 -22 -50 -36 -24 -8 15 -10 15 -15 0 -11 -27 -24 -18 -35 24 -8 32 -7 40 4 40 8 0 15 -8 15 -17z"
        className={icon.inverse}
      />
    </g>
  </svg>
);
