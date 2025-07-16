import type { BPReading } from './App'

type Category = {
  name: string
  color: string
  x2: number
  y2: number
}

type Props = {
  readings: BPReading[]
  maxSys: number
  minSys: number
  maxDia: number
  minDia: number
  graphHeight: number
  graphWidth: number
  padding: number
  categories: Category[]
}

export default function BPGraph({
  readings,
  maxSys,
  minSys,
  maxDia,
  minDia,
  graphHeight,
  graphWidth,
  padding,
  categories,
}: Props) {
  const getX = (diastolic: number) =>
    padding + ((diastolic - minDia) * (graphWidth - 2 * padding)) / (maxDia - minDia)
  const getY = (systolic: number) =>
    padding + ((maxSys - systolic) * (graphHeight - 2 * padding)) / (maxSys - minSys)

  return (
    <>
      <svg width={graphWidth} height={graphHeight} style={{ background: '#f9f9f9', border: '1px solid #ccc', boxShadow: '0 1px 4px 0 rgba(60,60,60,0.04)' }}>
        {/* Category backgrounds */}
        {categories.map((cat) => (
          <rect
            key={cat.name}
            x={getX(minDia)}
            y={getY(cat.y2)}
            width={getX(cat.x2) - getX(minDia)}
            height={getY(minSys) - getY(cat.y2)}
            fill={cat.color}
            stroke="none"
            opacity={0.85}
            // Removed rx={6} for sharp corners
          />
        ))}
        {/* Dots replaced with crosses */}
        {readings.map((r, i) => {
          const cx = getX(r.diastolic)
          const cy = getY(r.systolic)
          const crossSize = 7 // length of each line in the cross
          const half = crossSize / 2
          return (
            <g key={`cross-${i}`}>
              <line
                x1={cx - half}
                y1={cy - half}
                x2={cx + half}
                y2={cy + half}
                stroke="#000"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 1px 2px #8882)' }}
              />
              <line
                x1={cx - half}
                y1={cy + half}
                x2={cx + half}
                y2={cy - half}
                stroke="#000"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 1px 2px #8882)' }}
              />
            </g>
          )
        })}
        {/* Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={graphHeight - padding} stroke="#888" strokeWidth={1.5} />
        <line x1={padding} y1={graphHeight - padding} x2={graphWidth - padding} y2={graphHeight - padding} stroke="#888" strokeWidth={1.5} />
        {/* X-axis labels (diastolic) */}
        <text x={padding} y={graphHeight - padding + 18} fontSize={13} fill="#222">{minDia}</text>
        <text x={graphWidth - padding - 10} y={graphHeight - padding + 18} fontSize={13} fill="#222">{maxDia}</text>
        {/* Y-axis labels (systolic) */}
        <text x={0} y={padding + 8} fontSize={13} fill="#222">{maxSys}</text>
        <text x={0} y={graphHeight - padding} fontSize={13} fill="#222">{minSys}</text>
        {/* Axis titles */}
        <text
          x={12}
          y={graphHeight / 2}
          fontSize={15}
          fill="#222"
          textAnchor="middle"
          fontWeight={600}
          transform={`rotate(-90 12,${graphHeight / 2})`}
        >
          Systolic
        </text>
        <text
          x={graphWidth / 2}
          y={graphHeight - 8}
          fontSize={15}
          fill="#222"
          textAnchor="middle"
          fontWeight={600}
        >
          Diastolic
        </text>
      </svg>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 10, alignItems: 'center', fontSize: 13 }}>
        <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#3498db', borderRadius: 7, marginRight: 4, border: '1px solid #bbb' }} />Low</span>
        <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#81e88b', borderRadius: 7, marginRight: 4, border: '1px solid #bbb' }} />Healthy</span>
        <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#ffe082', borderRadius: 7, marginRight: 4, border: '1px solid #bbb' }} />Slightly Raised</span>
        <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#ffb3b3', borderRadius: 7, marginRight: 4, border: '1px solid #bbb' }} />High</span>
      </div>
    </>
  )
}
