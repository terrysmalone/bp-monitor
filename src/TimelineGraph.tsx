import React from 'react'
import type { BPReading } from './App'

type Props = {
  readings: BPReading[]
  graphHeight?: number
  graphWidth?: number
  padding?: number
}

export default function TimelineGraph({
  readings,
  graphHeight = 180,
  graphWidth = 400,
  padding = 30,
}: Props) {
  if (readings.length === 0) return null

  // Sort readings by date+timeOfDay ascending for timeline
  const sorted = [...readings].sort((a, b) => {
    if (a.date === b.date) {
      if (a.timeOfDay === b.timeOfDay) return 0
      return a.timeOfDay === 'morning' ? -1 : 1
    }
    return a.date.localeCompare(b.date)
  })

  // X axis: evenly spaced by index
  const getX = (i: number) =>
    padding + (i * (graphWidth - 2 * padding)) / Math.max(sorted.length - 1, 1)

  // Y axis: scale for systolic and diastolic
  const minSys = 0
  const maxSys = 170

  const getYSys = (value: number) =>
    padding + ((maxSys - value) * (graphHeight - 2 * padding)) / (maxSys - minSys)
  const getYDia = (value: number) =>
    padding + ((maxSys - value) * (graphHeight - 2 * padding)) / (maxSys - minSys)

  // Points for lines
  const sysPoints = sorted.map((r, i) => `${getX(i)},${getYSys(r.systolic)}`).join(' ')
  const diaPoints = sorted.map((r, i) => `${getX(i)},${getYDia(r.diastolic)}`).join(' ')

  // Date labels
  const dateLabels = sorted.map((r, i) => {
    const [year, month, day] = r.date.split('-')
    const label = `${day}/${month}${r.timeOfDay === 'morning' ? ' AM' : ' PM'}`
    return (
      <text
        key={i}
        x={getX(i)}
        y={graphHeight - padding + 22}
        fontSize={11}
        fill="#444"
        textAnchor="middle"
        style={{ fontFamily: 'monospace' }}
      >
        {label}
      </text>
    )
  })

  return (
    <div>
      <svg width={graphWidth} height={graphHeight + 28} style={{ background: '#f7fafd', border: '1px solid #ccc', borderRadius: 10, boxShadow: '0 1px 4px 0 rgba(60,60,60,0.04)' }}>
        {/* Systolic line */}
        <polyline
          fill="none"
          stroke="#e74c3c"
          strokeWidth={2.5}
          points={sysPoints}
          style={{ filter: 'drop-shadow(0 1px 2px #e74c3c33)' }}
        />
        {/* Diastolic line */}
        <polyline
          fill="none"
          stroke="#3498db"
          strokeWidth={2.5}
          points={diaPoints}
          style={{ filter: 'drop-shadow(0 1px 2px #3498db33)' }}
        />
        {/* Systolic dots */}
        {sorted.map((r, i) => (
          <circle
            key={`sys-dot-${i}`}
            cx={getX(i)}
            cy={getYSys(r.systolic)}
            r={4}
            fill="#e74c3c"
            stroke="#fff"
            strokeWidth={2}
            style={{ filter: 'drop-shadow(0 1px 2px #e74c3c33)' }}
          />
        ))}
        {/* Diastolic dots */}
        {sorted.map((r, i) => (
          <circle
            key={`dia-dot-${i}`}
            cx={getX(i)}
            cy={getYDia(r.diastolic)}
            r={4}
            fill="#3498db"
            stroke="#fff"
            strokeWidth={2}
            style={{ filter: 'drop-shadow(0 1px 2px #3498db33)' }}
          />
        ))}
        {/* Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={graphHeight - padding} stroke="#888" strokeWidth={1.5} />
        <line x1={padding} y1={graphHeight - padding} x2={graphWidth - padding} y2={graphHeight - padding} stroke="#888" strokeWidth={1.5} />
        {/* Y-axis labels */}
        <text x={10} y={padding + 8} fontSize={13} fill="#222">{maxSys}</text>
        <text x={10} y={graphHeight - padding} fontSize={13} fill="#222">{minSys}</text>
        {/* X-axis date labels */}
        {dateLabels}
        {/* Axis titles */}
        <text
          x={graphWidth / 2}
          y={graphHeight + 18}
          fontSize={15}
          fill="#222"
          textAnchor="middle"
          fontWeight={600}
        >
          Date/Time
        </text>
        <text
          x={28}
          y={graphHeight / 2}
          fontSize={15}
          fill="#222"
          textAnchor="middle"
          fontWeight={600}
          transform={`rotate(-90 28,${graphHeight / 2})`}
        >
          BP Value
        </text>
        {/* Legend */}
        <rect x={graphWidth - 120} y={padding} width={12} height={12} fill="#e74c3c" rx={3} />
        <text x={graphWidth - 102} y={padding + 11} fontSize={12} fill="#e74c3c" fontWeight={600}>Systolic</text>
        <rect x={graphWidth - 120} y={padding + 18} width={12} height={12} fill="#3498db" rx={3} />
        <text x={graphWidth - 102} y={padding + 29} fontSize={12} fill="#3498db" fontWeight={600}>Diastolic</text>
      </svg>
    </div>
  )
}

