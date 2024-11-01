export type IconProps = {
  name: keyof typeof ICONS;
  color?: 'white' | 'black' | 'currentColor';
  width?: string | number;
  height?: string | number;
};

type SvgProps = {
  color?: 'white' | 'black' | 'currentColor';
  width?: string | number;
  height?: string | number;
};

export function Icon({
  name,
  color = 'white',
  width = '24',
  height = '24',
}: IconProps) {
  const icon = ICONS[name];
  if (icon) {
    return icon({ color, width, height });
  }
  return null;
}

const ICONS: Record<string, (props: SvgProps) => JSX.Element> = {
  vite: ({ color, width, height }: SvgProps) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 410 404"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Vite</title>
      <path
        d="M399.641 59.5246L215.643 388.545C211.844 395.338 202.084 395.378 198.228 388.618L10.5817 59.5563C6.38087 52.1896 12.6802 43.2665 21.0281 44.7586L205.223 77.6824C206.398 77.8924 207.601 77.8904 208.776 77.6763L389.119 44.8058C397.439 43.2894 403.768 52.1434 399.641 59.5246Z"
        fill={color}
      />
      <path
        d="M292.965 1.5744L156.801 28.2552C154.563 28.6937 152.906 30.5903 152.771 32.8664L144.395 174.33C144.198 177.662 147.258 180.248 150.51 179.498L188.42 170.749C191.967 169.931 195.172 173.055 194.443 176.622L183.18 231.775C182.422 235.487 185.907 238.661 189.532 237.56L212.947 230.446C216.577 229.344 220.065 232.527 219.297 236.242L201.398 322.875C200.278 328.294 207.486 331.249 210.492 326.603L212.5 323.5L323.454 102.072C325.312 98.3645 322.108 94.137 318.036 94.9228L279.014 102.454C275.347 103.161 272.227 99.746 273.262 96.1583L298.731 7.86689C299.767 4.27314 296.636 0.855181 292.965 1.5744Z"
        fill={color}
        stroke={color === 'black' ? 'white' : 'black'}
        strokeWidth="8"
      />
    </svg>
  ),
  remix: ({ color, width, height }: SvgProps) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 411 473"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Remix</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M392.946 364.768C397.201 419.418 397.201 445.036 397.201 473H270.756C270.756 466.909 270.865 461.337 270.975 455.687C271.317 438.123 271.674 419.807 268.828 382.819C265.067 328.667 241.748 316.634 198.871 316.634H160.883H0V218.109H204.889C259.049 218.109 286.13 201.633 286.13 158.011C286.13 119.654 259.049 96.4098 204.889 96.4098H0V0H227.456C350.069 0 411 57.9117 411 150.42C411 219.613 368.123 264.739 310.201 272.26C359.096 282.037 387.681 309.865 392.946 364.768Z"
        fill={color}
      />
      <path
        d="M0 473V399.553H133.697C156.029 399.553 160.878 416.116 160.878 425.994V473H0Z"
        fill={color}
      />
    </svg>
  ),
  astro: ({ color, width, height }: SvgProps) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 85 107"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Astro</title>
      <path
        d="M27.5893 91.1365C22.7555 86.7178 21.3443 77.4335 23.3583 70.7072C26.8503 74.948 31.6888 76.2914 36.7005 77.0497C44.4374 78.2199 52.0358 77.7822 59.2231 74.2459C60.0453 73.841 60.8052 73.3027 61.7036 72.7574C62.378 74.714 62.5535 76.6892 62.3179 78.6996C61.7452 83.5957 59.3086 87.3778 55.4332 90.2448C53.8835 91.3916 52.2437 92.4167 50.6432 93.4979C45.7262 96.8213 44.3959 100.718 46.2435 106.386C46.2874 106.525 46.3267 106.663 46.426 107C43.9155 105.876 42.0817 104.24 40.6844 102.089C39.2086 99.8193 38.5065 97.3081 38.4696 94.5909C38.4511 93.2686 38.4511 91.9345 38.2733 90.6309C37.8391 87.4527 36.3471 86.0297 33.5364 85.9478C30.6518 85.8636 28.37 87.6469 27.7649 90.4554C27.7187 90.6707 27.6517 90.8837 27.5847 91.1341L27.5893 91.1365Z"
        fill={color}
      />
      <path
        d="M0 69.5866C0 69.5866 14.3139 62.6137 28.6678 62.6137L39.4901 29.1204C39.8953 27.5007 41.0783 26.3999 42.4139 26.3999C43.7495 26.3999 44.9325 27.5007 45.3377 29.1204L56.1601 62.6137C73.1601 62.6137 84.8278 69.5866 84.8278 69.5866C84.8278 69.5866 60.5145 3.35233 60.467 3.21944C59.7692 1.2612 58.5911 0 57.0029 0H27.8274C26.2392 0 25.1087 1.2612 24.3634 3.21944C24.3108 3.34983 0 69.5866 0 69.5866Z"
        fill={color}
      />
    </svg>
  ),
  nextjs: ({ color, width, height }: SvgProps) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_408_139"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="180"
        height="180"
      >
        <circle cx="90" cy="90" r="90" fill={color === 'white' ? 'white' : 'black'} />
      </mask>
      <g mask="url(#mask0_408_139)">
        <circle
          cx="90"
          cy="90"
          r="87"
          fill={color === 'white' ? 'white' : 'black'}
          stroke={color === 'white' ? 'black' : 'white'}
          strokeWidth="6"
        />
        <path
          d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
          fill="url(#paint0_linear_408_139)"
        />
        <rect
          x="115"
          y="54"
          width="12"
          height="72"
          fill="url(#paint1_linear_408_139)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_408_139"
          x1="109"
          y1="116.5"
          x2="144.5"
          y2="160.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color === 'white' ? 'black' : 'white'} />
          <stop offset="1" stopColor={color === 'white' ? 'black' : 'white'} stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_408_139"
          x1="121"
          y1="54"
          x2="120.799"
          y2="106.875"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color === 'white' ? 'black' : 'white'} />
          <stop offset="1" stopColor={color === 'white' ? 'black' : 'white'} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  ),
};
