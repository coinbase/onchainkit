export const defaultLoadingSVG = (
  <svg
    data-testid="ockAvatarLoadingSvg"
    role="img"
    aria-label="ock-avatar-loading-image"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="8"
      cy="8"
      r="7.2"
      stroke="#333"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 8 8"
        to="360 8 8"
        dur="1s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);
