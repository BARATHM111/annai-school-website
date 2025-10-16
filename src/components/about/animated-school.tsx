"use client"

export default function AnimatedSchool() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg viewBox="0 0 600 400" className="w-full max-w-2xl" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}>
        <defs>
          <style>{`
            @keyframes flagWave {
              0%, 100% { transform: scaleX(1); }
              50% { transform: scaleX(0.9); }
            }
            
            @keyframes windowLight {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.8; }
            }
            
            @keyframes cloudFloat {
              0%, 100% { transform: translateX(0); }
              50% { transform: translateX(30px); }
            }
            
            @keyframes sunRotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            
            @keyframes birdFly {
              0% { transform: translate(0, 0); }
              100% { transform: translate(150px, -20px); }
            }
            
            .flag { 
              animation: flagWave 2s ease-in-out infinite;
              transform-origin: left center;
            }
            
            .window-light {
              animation: windowLight 3s ease-in-out infinite;
            }
            
            .cloud {
              animation: cloudFloat 15s ease-in-out infinite;
            }
            
            .sun {
              animation: sunRotate 30s linear infinite;
              transform-origin: center;
            }
            
            .bird {
              animation: birdFly 8s linear infinite;
            }
          `}</style>
        </defs>

        {/* Sky Background - Navy to Light */}
        <rect width="600" height="400" fill="url(#skyGradient)" />
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.65 0.08 240)" />
            <stop offset="50%" stopColor="oklch(0.85 0.04 240)" />
            <stop offset="100%" stopColor="oklch(0.95 0.01 240)" />
          </linearGradient>
        </defs>

        {/* Sun - Warm Gold */}
        <g className="sun">
          <circle cx="500" cy="80" r="30" fill="oklch(0.75 0.18 60)" />
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1="500"
              y1="80"
              x2="500"
              y2="40"
              stroke="oklch(0.75 0.18 60)"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${i * 45} 500 80)`}
            />
          ))}
        </g>

        {/* Clouds - Subtle white/gold tint */}
        <g className="cloud">
          <ellipse cx="120" cy="60" rx="30" ry="20" fill="oklch(0.98 0.02 60)" opacity="0.9" />
          <ellipse cx="150" cy="55" rx="35" ry="25" fill="oklch(0.98 0.02 60)" opacity="0.9" />
          <ellipse cx="180" cy="60" rx="30" ry="20" fill="oklch(0.98 0.02 60)" opacity="0.9" />
        </g>

        <g className="cloud" style={{ animationDelay: '3s', animationDuration: '20s' }}>
          <ellipse cx="380" cy="90" rx="25" ry="15" fill="oklch(0.98 0.02 60)" opacity="0.8" />
          <ellipse cx="405" cy="85" rx="30" ry="20" fill="oklch(0.98 0.02 60)" opacity="0.8" />
          <ellipse cx="430" cy="90" rx="25" ry="15" fill="oklch(0.98 0.02 60)" opacity="0.8" />
        </g>

        {/* Birds - Navy color */}
        <g className="bird">
          <path d="M20,120 Q25,115 30,120" stroke="oklch(0.25 0.08 240)" strokeWidth="2" fill="none" />
          <path d="M30,120 Q35,115 40,120" stroke="oklch(0.25 0.08 240)" strokeWidth="2" fill="none" />
        </g>

        {/* Ground - Professional green */}
        <rect x="0" y="320" width="600" height="80" fill="oklch(0.35 0.12 150)" />
        <rect x="0" y="310" width="600" height="10" fill="oklch(0.45 0.14 150)" />

        {/* School Building */}
        <rect x="150" y="150" width="300" height="160" fill="hsl(var(--primary))" />

        {/* Roof - Warm accent color */}
        <polygon points="130,150 300,100 470,150" fill="oklch(0.55 0.15 30)" />

        {/* School Name Plate - Gold accent */}
        <rect x="220" y="120" width="160" height="25" fill="oklch(0.65 0.15 45)" stroke="hsl(var(--primary))" strokeWidth="2" rx="5" />
        <text x="300" y="137" textAnchor="middle" fill="oklch(0.15 0.02 240)" fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif">
          ANNAI SCHOOL
        </text>

        {/* Flag Pole - Navy */}
        <rect x="295" y="70" width="4" height="30" fill="oklch(0.25 0.08 240)" />
        
        {/* Animated Flag - Warm gold */}
        <path className="flag" d="M299,70 L299,85 L320,80 L299,75 Z" fill="oklch(0.65 0.15 45)" />

        {/* Windows - Row 1 */}
        {[...Array(5)].map((_, i) => (
          <g key={`r1-${i}`}>
            <rect
              x={180 + i * 50}
              y="170"
              width="30"
              height="30"
              fill="oklch(0.85 0.04 240)"
              stroke="oklch(0.98 0.005 85)"
              strokeWidth="2"
            />
            <line x1={180 + i * 50 + 15} y1="170" x2={180 + i * 50 + 15} y2="200" stroke="oklch(0.98 0.005 85)" strokeWidth="2" />
            <line x1={180 + i * 50} y1="185" x2={180 + i * 50 + 30} y2="185" stroke="oklch(0.98 0.005 85)" strokeWidth="2" />
            <rect
              className="window-light"
              x={180 + i * 50}
              y="170"
              width="30"
              height="30"
              fill="oklch(0.75 0.18 60)"
              opacity="0"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          </g>
        ))}

        {/* Windows - Row 2 */}
        {[...Array(5)].map((_, i) => (
          <g key={`r2-${i}`}>
            <rect
              x={180 + i * 50}
              y="220"
              width="30"
              height="30"
              fill="oklch(0.85 0.04 240)"
              stroke="oklch(0.98 0.005 85)"
              strokeWidth="2"
            />
            <line x1={180 + i * 50 + 15} y1="220" x2={180 + i * 50 + 15} y2="250" stroke="oklch(0.98 0.005 85)" strokeWidth="2" />
            <line x1={180 + i * 50} y1="235" x2={180 + i * 50 + 30} y2="235" stroke="oklch(0.98 0.005 85)" strokeWidth="2" />
            <rect
              className="window-light"
              x={180 + i * 50}
              y="220"
              width="30"
              height="30"
              fill="oklch(0.75 0.18 60)"
              opacity="0"
              style={{ animationDelay: `${i * 0.5 + 1}s` }}
            />
          </g>
        ))}

        {/* Windows - Row 3 */}
        {[...Array(5)].map((_, i) => (
          <g key={`r3-${i}`}>
            <rect
              x={180 + i * 50}
              y="270"
              width="30"
              height="30"
              fill="oklch(0.85 0.04 240)"
              stroke="oklch(0.98 0.005 85)"
              strokeWidth="2"
            />
            <line x1={180 + i * 50 + 15} y1="270" x2={180 + i * 50 + 15} y2="300" stroke="oklch(0.98 0.005 85)" strokeWidth="2" />
            <line x1={180 + i * 50} y1="285" x2={180 + i * 50 + 30} y2="285" stroke="oklch(0.98 0.005 85)" strokeWidth="2" />
            <rect
              className="window-light"
              x={180 + i * 50}
              y="270"
              width="30"
              height="30"
              fill="oklch(0.75 0.18 60)"
              opacity="0"
              style={{ animationDelay: `${i * 0.5 + 1.5}s` }}
            />
          </g>
        ))}

        {/* Main Door - Warm brown */}
        <rect x="275" y="250" width="50" height="60" fill="oklch(0.45 0.12 30)" stroke="oklch(0.35 0.10 30)" strokeWidth="2" />
        <circle cx="290" cy="280" r="3" fill="oklch(0.75 0.18 60)" />
        <line x1="300" y1="250" x2="300" y2="310" stroke="oklch(0.35 0.10 30)" strokeWidth="2" />

        {/* Trees */}
        <g>
          <rect x="80" y="280" width="15" height="40" fill="oklch(0.45 0.12 30)" />
          <polygon points="87.5,245 65,280 110,280" fill="oklch(0.35 0.12 150)" />
          <polygon points="87.5,260 70,285 105,285" fill="oklch(0.35 0.12 150)" />
        </g>

        <g>
          <rect x="505" y="280" width="15" height="40" fill="oklch(0.45 0.12 30)" />
          <polygon points="512.5,245 490,280 535,280" fill="oklch(0.35 0.12 150)" />
          <polygon points="512.5,260 495,285 530,285" fill="oklch(0.35 0.12 150)" />
        </g>

        {/* Flowers - Gold accent */}
        {[...Array(8)].map((_, i) => (
          <g key={`flower-${i}`}>
            <circle cx={100 + i * 60} cy="315" r="3" fill="oklch(0.65 0.15 45)" />
            <circle cx={100 + i * 60} cy="315" r="2" fill="oklch(0.85 0.18 60)" />
          </g>
        ))}
      </svg>
    </div>
  )
}
