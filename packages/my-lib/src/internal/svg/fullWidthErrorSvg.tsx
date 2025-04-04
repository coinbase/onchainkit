type ErrorSvgProps = {
  fill?: string;
};

export const ErrorSvg = ({ fill = '#E11D48' }: ErrorSvgProps) => (
  <svg
    aria-label="ock-errorSvg"
    width="100%"
    height="100%"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="ock-errorSvg"
  >
    <title>Error</title>
    <path
      d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58171 12.4183 0 8 0C3.58172 0 0 3.58171 0 8C0 12.4183 3.58172 16 8 16ZM11.7576 5.0909L8.84853 8L11.7576 10.9091L10.9091 11.7576L8 8.84851L5.09093 11.7576L4.2424 10.9091L7.15147 8L4.2424 5.0909L5.09093 4.24239L8 7.15145L10.9091 4.24239L11.7576 5.0909Z"
      fill={fill}
    />
  </svg>
);
