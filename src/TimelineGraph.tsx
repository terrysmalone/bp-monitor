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
  const minDia = 0
  const maxDia = 100

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
        y={graphHeight - padding + 18}
        fontSize={10}
        fill="#000"
        textAnchor="middle"
      >
        {label}
      </text>
    )
  })

  return (
    <div>
      <svg width={graphWidth} height={graphHeight + 20} style={{ background: '#fafafa', border: '1px solid #ccc' }}>
        {/* Systolic line */}
        <polyline
          fill="none"
          stroke="#e74c3c"
          strokeWidth={2}
          points={sysPoints}
        />
        {/* Diastolic line */}
        <polyline
          fill="none"
          stroke="#3498db"
          strokeWidth={2}
          points={diaPoints}
        />
        {/* Systolic dots */}
        {sorted.map((r, i) => (
          <circle
            key={`sys-dot-${i}`}
            cx={getX(i)}
            cy={getYSys(r.systolic)}
            r={3}
            fill="#e74c3c"
            stroke="#fff"
            strokeWidth={1}
          />
        ))}
        {/* Diastolic dots */}
        {sorted.map((r, i) => (
          <circle
            key={`dia-dot-${i}`}
            cx={getX(i)}
            cy={getYDia(r.diastolic)}
            r={3}
            fill="#3498db"
            stroke="#fff"
            strokeWidth={1}
          />
        ))}
        {/* Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={graphHeight - padding} stroke="#888" />
        <line x1={padding} y1={graphHeight - padding} x2={graphWidth - padding} y2={graphHeight - padding} stroke="#888" />
        {/* Y-axis labels */}
        <text x={5} y={padding + 5} fontSize={12} fill="#000">{maxSys}</text>
        <text x={5} y={graphHeight - padding} fontSize={12} fill="#000">{minSys}</text>
        {/* X-axis date labels */}
        {dateLabels}
        {/* Axis titles */}
        <text
          x={graphWidth / 2}
          y={graphHeight + 10}
          fontSize={13}
          fill="#000"
          textAnchor="middle"
        >
          Date/Time
        </text>
        <text
          x={18}
          y={graphHeight / 2}
          fontSize={13}
          fill="#000"
          textAnchor="middle"
          transform={`rotate(-90 18,${graphHeight / 2})`}
        >
          BP Value
        </text>
        {/* Legend */}
        <rect x={graphWidth - 120} y={padding} width={10} height={10} fill="#e74c3c" />
        <text x={graphWidth - 105} y={padding + 9} fontSize={11} fill="#e74c3c">Systolic</text>
        <rect x={graphWidth - 120} y={padding + 16} width={10} height={10} fill="#3498db" />
        <text x={graphWidth - 105} y={padding + 25} fontSize={11} fill="#3498db">Diastolic</text>
      </svg>
    </div>
  )
}
