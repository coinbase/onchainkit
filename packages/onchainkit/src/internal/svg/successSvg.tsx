type SuccessSvgProps = {
  fill?: string;
};

export const SuccessSvg = ({ fill = '#65A30D' }: SuccessSvgProps) => (
  <svg
    aria-label="ock-successSvg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="ock-successSvg"
  >
    <title>Success SVG</title>
    <path
      d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM6.72667 11.5333L3.73333 8.54L4.67333 7.6L6.72667 9.65333L11.44 4.94L12.38 5.88L6.72667 11.5333Z"
      fill={fill}
    />
  </svg>
);
