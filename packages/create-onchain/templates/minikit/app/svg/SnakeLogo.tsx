import React from "react";

const SnakeLogo = ({
  width = 164,
  height = 34,
  color = "#0052FF",
  animate = false,
}: {
  width?: number | string;
  height?: number | string;
  color?: string;
  animate?: boolean;
}) => {
  // [x, y, width, height]
  // each letter is 28px wide and 34px high with 6px padding between letters
  const segments = [
    [
      // top Row
      [4, 0, 18, 4], // S
      [34, 0, 10, 4], // N
      [52, 0, 10, 4], // N
      [77, 0, 10, 4], // A
      [102, 0, 10, 4], // K
      [120, 0, 10, 4], // K
      [136, 0, 28, 4], // E
    ],

    [
      // second Row
      [0, 5, 10, 4], // S
      [16, 5, 10, 4], // S
      [34, 5, 14, 4], // N
      [52, 5, 10, 4], // N
      [72, 5, 20, 4], // A
      [102, 5, 10, 4], // K
      [116, 5, 10, 4], // K
      [136, 5, 10, 4], // E
    ],

    [
      // third Row
      [0, 10, 8, 4], // S
      [34, 10, 28, 4], // N
      [68, 10, 10, 4], // A
      [86, 10, 10, 4], // A
      [102, 10, 20, 4], // K
      [136, 10, 10, 4], // E
    ],

    [
      // fourth Row
      [4, 15, 20, 4], // S
      [34, 15, 10, 4], // N
      [48, 15, 14, 4], // N
      [68, 15, 28, 4], // A
      [102, 15, 16, 4], // K
      [136, 15, 20, 4], // E
    ],

    [
      // fifth Row
      [20, 20, 8, 4], // S
      [34, 20, 10, 4], // N
      [52, 20, 10, 4], // N
      [68, 20, 10, 4], // A
      [86, 20, 10, 4], // A
      [102, 20, 20, 4], // K
      [136, 20, 10, 4], // E
    ],

    [
      // sixth Row
      [0, 25, 8, 4], // S
      [20, 25, 8, 4], // S
      [34, 25, 10, 4], // N
      [52, 25, 10, 4], // N
      [68, 25, 10, 4], // A
      [86, 25, 10, 4], // A
      [102, 25, 10, 4], // K
      [116, 25, 10, 4], // K
      [136, 25, 10, 4], // E
    ],

    [
      // seventh Row
      [4, 30, 20, 4], // S
      [34, 30, 10, 4], // N
      [52, 30, 10, 4], // N
      [68, 30, 10, 4], // A
      [86, 30, 10, 4], // A
      [102, 30, 10, 4], // K
      [120, 30, 10, 4], // K
      [136, 30, 28, 4], // E
    ],
  ];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 164 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {segments.map((row, i) => {
        return (
          <g key={i} opacity={0}>
            {row.map(([x, y, width, height], j) => (
              <rect
                key={j}
                x={x}
                y={y}
                width={width}
                height={height}
                rx={2.34}
                ry={2.34}
                fill={animate ? "currentColor" : color}
              >
                {animate && (
                  <animate
                    attributeName="fill"
                    values="#FF0000;#FF7F00;#FFFF00;#00FF00;#0000FF;#4B0082;#8F00FF;#FF0000"
                    dur="4s"
                    repeatCount="indefinite"
                    begin={`${i * 0.2}s`}
                  />
                )}
              </rect>
            ))}
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="0.5s"
              begin={`${i * 0.2}s`}
              fill="freeze"
            />
          </g>
        );
      })}
    </svg>
  );
};

export default SnakeLogo;
