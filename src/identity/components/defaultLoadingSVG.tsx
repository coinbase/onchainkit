export const defaultLoadingSVG = (
  <svg
    data-testid="ockAvatarLoadingSvg"
    role="img"
    aria-label="ock-avatar-loading-image"
    width="32"
    height="32"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="50"
      cy="50"
      r="45"
      stroke="#333"
      fill="none"
      strokeWidth="10"
      strokeLinecap="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 50 50"
        to="360 50 50"
        dur="1s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);
