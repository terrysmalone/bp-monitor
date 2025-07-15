import { useState } from 'react'
import './App.css'

type BPReading = {
  date: string
  systolic: number
  diastolic: number
}

function App() {
  const [readings, setReadings] = useState<BPReading[]>([])
  const [date, setDate] = useState('')
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !systolic || !diastolic) return
    setReadings([
      ...readings,
      {
        date,
        systolic: Number(systolic),
        diastolic: Number(diastolic),
      },
    ])
    setDate('')
    setSystolic('')
    setDiastolic('')
  }

  // Fixed graph bounds
  const maxSys = 170
  const minSys = 0
  const maxDia = 100
  const minDia = 0
  const graphHeight = 200
  const graphWidth = 400
  const padding = 30

  // X axis: diastolic (0–100)
  const getX = (diastolic: number) =>
    padding + ((diastolic - minDia) * (graphWidth - 2 * padding)) / (maxDia - minDia)
  // Y axis: systolic (0–170, 0 at bottom)
  const getY = (systolic: number) =>
    padding + ((maxSys - systolic) * (graphHeight - 2 * padding)) / (maxSys - minSys)

  // Points for polyline and dots
  const points = readings.map(r => {
    const x = getX(r.diastolic)
    const y = getY(r.systolic)
    return `${x},${y}`
  }).join(' ')

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: 16 }}>
      <h1>Blood Pressure Monitor</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div>
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Systolic:
            <input
              type="number"
              value={systolic}
              onChange={e => setSystolic(e.target.value)}
              required
              min={50}
              max={250}
            />
          </label>
        </div>
        <div>
          <label>
            Diastolic:
            <input
              type="number"
              value={diastolic}
              onChange={e => setDiastolic(e.target.value)}
              required
              min={30}
              max={150}
            />
          </label>
        </div>
        <button type="submit">Add Reading</button>
      </form>

      {readings.length > 0 && (
        <>
          <h2>Readings</h2>
          <table style={{ width: '100%', marginBottom: 24 }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Systolic</th>
                <th>Diastolic</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td>{r.systolic}</td>
                  <td>{r.diastolic}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Graph</h2>
          <svg width={graphWidth} height={graphHeight} style={{ background: '#f9f9f9', border: '1px solid #ccc' }}>
            {/* Line connecting points */}
            <polyline
              fill="none"
              stroke="#8e44ad"
              strokeWidth={2}
              points={points}
            />
            {/* Dots */}
            {readings.map((r, i) => (
              <circle
                key={`dot-${i}`}
                cx={getX(r.diastolic)}
                cy={getY(r.systolic)}
                r={4}
                fill="#8e44ad"
                stroke="#fff"
                strokeWidth={1}
              />
            ))}
            {/* Axes */}
            <line x1={padding} y1={padding} x2={padding} y2={graphHeight - padding} stroke="#888" />
            <line x1={padding} y1={graphHeight - padding} x2={graphWidth - padding} y2={graphHeight - padding} stroke="#888" />
            {/* X-axis labels (diastolic) */}
            <text x={padding} y={graphHeight - padding + 15} fontSize={12} fill="#3498db">{minDia}</text>
            <text x={graphWidth - padding - 10} y={graphHeight - padding + 15} fontSize={12} fill="#3498db">{maxDia}</text>
            {/* Y-axis labels (systolic) */}
            <text x={5} y={padding + 5} fontSize={12} fill="#e74c3c">{maxSys}</text>
            <text x={5} y={graphHeight - padding} fontSize={12} fill="#e74c3c">{minSys}</text>
          </svg>
        </>
      )}
    </div>
  )
}

export default App
