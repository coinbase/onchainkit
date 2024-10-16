export default function ImageSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="sphereGradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#4da6ff">
            <animate
              attributeName="stop-color"
              values="#4da6ff;#00ccff;#0066cc;#6600cc;#4da6ff"
              dur="5s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="70%" stopColor="#0066cc">
            <animate
              attributeName="stop-color"
              values="#0066cc;#0099ff;#003366;#3300cc;#0066cc"
              dur="5s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#004080">
            <animate
              attributeName="stop-color"
              values="#004080;#006699;#000033;#000099;#004080"
              dur="5s"
              repeatCount="indefinite"
            />
          </stop>
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="40" fill="url(#sphereGradient)">
        <animate
          attributeName="r"
          values="40;42;40"
          dur="2s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
        />
      </circle>
    </svg>
  );
}
