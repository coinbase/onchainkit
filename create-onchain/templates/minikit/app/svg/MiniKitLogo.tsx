import React from 'react';

const MiniKitLogo = ({ width = 200, height = 60 }: { width?: number | string, height?: number | string }) => {
  return (
    <svg 
      width={width} 
      height={height}
      viewBox="0 0 200 60">
      <defs>
        <linearGradient id="chrome" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0" stopColor="#FF1177">
            <animate
              attributeName="stop-color"
              values="#FF1177; #FF00FF; #00FFFF; #FF1177"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#00FFFF">
            <animate
              attributeName="stop-color"
              values="#00FFFF; #FF1177; #FF00FF; #00FFFF"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* background grid */}
      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#FF00FF22" strokeWidth="0.5"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* shadow text */}
      <text 
        x="100" 
        y="4" 
        dominantBaseline="middle" 
        textAnchor="middle"
        fill="#000"
        style={{
          fontSize: '40px',
          fontWeight: '900',
          fontFamily: 'Arial Black, Impact, sans-serif',
          letterSpacing: '2px'
        }}
        transform="skewY(-10)"
      >
        MINIKIT
      </text>

      {/* main text */}
      <text 
        x="100" 
        y="3" 
        dominantBaseline="middle" 
        textAnchor="middle"
        fill="url(#chrome)"
        filter="url(#glow)"
        style={{
          fontSize: '40px',
          fontWeight: '900',
          fontFamily: 'Arial Black, Impact, sans-serif',
          letterSpacing: '2px'
        }}
        transform="skewY(-10)"
      >
        <animate
          attributeName="y"
          values="4;3;4"
          dur="0.5s"
          repeatCount="indefinite"
          calcMode="linear"
        />
        MINIKIT
      </text>

      {/* sunburst lines */}
      <g transform="translate(100,30)" stroke="#FF00FF33" strokeWidth="0.5">
        {[...Array(12)].map((_, i) => (
          <line 
            key={i}
            x1="0"
            y1="0"
            x2={Math.cos(i * Math.PI / 6) * 200}
            y2={Math.sin(i * Math.PI / 6) * 200}
          />
        ))}
      </g>
    </svg>
  );
};

export default MiniKitLogo;