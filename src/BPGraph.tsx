import React from 'react'
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
      <svg width={graphWidth} height={graphHeight} style={{ background: '#f9f9f9', border: '1px solid #ccc' }}>
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
          />
        ))}
        {/* Dots */}
        {readings.map((r, i) => (
          <circle
            key={`dot-${i}`}
            cx={getX(r.diastolic)}
            cy={getY(r.systolic)}
            r={4}
            fill="#000"
            stroke="#fff"
            strokeWidth={1}
          />
        ))}
        {/* Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={graphHeight - padding} stroke="#888" />
        <line x1={padding} y1={graphHeight - padding} x2={graphWidth - padding} y2={graphHeight - padding} stroke="#888" />
        {/* X-axis labels (diastolic) */}
        <text x={padding} y={graphHeight - padding + 15} fontSize={12} fill="#000">{minDia}</text>
        <text x={graphWidth - padding - 10} y={graphHeight - padding + 15} fontSize={12} fill="#000">{maxDia}</text>
        {/* Y-axis labels (systolic) */}
        <text x={5} y={padding + 5} fontSize={12} fill="#000">{maxSys}</text>
        <text x={5} y={graphHeight - padding} fontSize={12} fill="#000">{minSys}</text>
        {/* Axis titles */}
        <text
          x={graphWidth / 2}
          y={graphHeight - 5}
          fontSize={14}
          fill="#000"
          textAnchor="middle"
        >
          Diastolic
        </text>
        <text
          x={18}
          y={graphHeight / 2}
          fontSize={14}
          fill="#000"
          textAnchor="middle"
          transform={`rotate(-90 18,${graphHeight / 2})`}
        >
          Systolic
        </text>
      </svg>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 8, alignItems: 'center' }}>
        <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#3498db', borderRadius: 6, marginRight: 4 }} />Low</span>
        <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#27ae60', borderRadius: 6, marginRight: 4 }} />Healthy</span>
        <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#f39c12', borderRadius: 6, marginRight: 4 }} />Slightly Raised</span>
        <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#e74c3c', borderRadius: 6, marginRight: 4 }} />High</span>
      </div>
    </>
  )
}
