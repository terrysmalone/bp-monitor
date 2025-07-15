import { useState, useEffect } from 'react'
import './App.css'

type BPReading = {
  date: string
  systolic: number
  diastolic: number
  timeOfDay: 'morning' | 'evening'
}

function App() {
  const [readings, setReadings] = useState<BPReading[]>(() => {
    const stored = localStorage.getItem('bp-readings')
    return stored ? JSON.parse(stored) : []
  })
  const [date, setDate] = useState('')
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'evening'>('morning')

  useEffect(() => {
    localStorage.setItem('bp-readings', JSON.stringify(readings))
  }, [readings])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !systolic || !diastolic || !timeOfDay) return
    setReadings([
      ...readings,
      {
        date,
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        timeOfDay,
      },
    ])
    setDate('')
    setSystolic('')
    setDiastolic('')
    setTimeOfDay('morning')
  }

  // Export readings as text file
  const handleExport = () => {
    const header = 'date,timeOfDay,systolic,diastolic'
    const lines = readings.map(r =>
      [r.date, r.timeOfDay, r.systolic, r.diastolic].join(',')
    )
    const content = [header, ...lines].join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bp-readings.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Import readings from text file
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      // Split on both \n and \r\n to support all platforms, and filter out empty lines
      const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
      if (lines.length < 2) return
      const imported: BPReading[] = []
      for (let i = 1; i < lines.length; i++) {
        const [date, timeOfDay, systolic, diastolic] = lines[i].split(',')
        if (
          date &&
          (timeOfDay === 'morning' || timeOfDay === 'evening') &&
          !isNaN(Number(systolic)) &&
          !isNaN(Number(diastolic))
        ) {
          imported.push({
            date,
            timeOfDay,
            systolic: Number(systolic),
            diastolic: Number(diastolic),
          })
        }
      }
      // Replace readings with imported readings only
      setReadings(imported)
    }
    reader.readAsText(file)
    // Reset the input so the same file can be imported again if needed
    e.target.value = ''
  }

  const maxSys = 170
  const minSys = 0
  const maxDia = 100
  const minDia = 0
  const graphHeight = 200
  const graphWidth = 400
  const padding = 30

  const getX = (diastolic: number) =>
    padding + ((diastolic - minDia) * (graphWidth - 2 * padding)) / (maxDia - minDia)
  const getY = (systolic: number) =>
    padding + ((maxSys - systolic) * (graphHeight - 2 * padding)) / (maxSys - minSys)

  // Draw from largest to smallest so smaller blocks are on top
  const categories = [
    {
      name: 'High',
      color: '#ffb3b3',
      x2: maxDia,
      y2: maxSys,
    },
    {
      name: 'Slightly Raised',
      color: '#ffe082',
      x2: 85,
      y2: 135,
    },
    {
      name: 'Healthy',
      color: '#81e88b',
      x2: 80,
      y2: 120,
    },
    {
      name: 'Low',
      color: '#82b6ff',
      x2: 60,
      y2: 90,
    },
  ]

  // Sort readings by date descending, and for same date, PM above AM
  const sortedReadings = [...readings].sort((a, b) => {
    if (a.date === b.date) {
      // PM above AM
      if (a.timeOfDay === b.timeOfDay) return 0
      return a.timeOfDay === 'evening' ? -1 : 1
    }
    return b.date.localeCompare(a.date)
  })

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: 16, display: 'flex', alignItems: 'flex-start', gap: 32 }}>
      {/* Left: Date-ordered readings list */}
      <div style={{ minWidth: 180, textAlign: 'left' }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Readings</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {sortedReadings.map((r, i) => {
            // Format date as YYYY-MM-DD to DD/MM/YYYY
            const [year, month, day] = r.date.split('-')
            const formattedDate = `${day}/${month}/${year}`
            const timeLabel = r.timeOfDay === 'morning' ? 'AM' : 'PM'
            return (
              <li
                key={i}
                style={{
                  marginBottom: 8,
                  fontSize: 15,
                  borderBottom: '1px solid #eee',
                  paddingBottom: 4,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{formattedDate} {timeLabel}</span>
                <span>{r.systolic}/{r.diastolic}</span>
              </li>
            )
          })}
        </ul>
        {/* Import/Export Buttons */}
        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'inline-block', cursor: 'pointer', marginRight: 8 }}>
            <span style={{ textDecoration: 'underline', color: '#0074d9' }} onClick={handleExport}>Export</span>
          </label>
          <label style={{ display: 'inline-block', cursor: 'pointer' }}>
            <span style={{ textDecoration: 'underline', color: '#0074d9' }}>Import</span>
            <input
              type="file"
              accept=".txt"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>
      {/* Right: Form and Graph */}
      <div style={{ flex: 1 }}>
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
          <div>
            <label>
              Time of Day:
              <select
                value={timeOfDay}
                onChange={e => setTimeOfDay(e.target.value as 'morning' | 'evening')}
                required
                style={{ marginLeft: 8 }}
              >
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
              </select>
            </label>
          </div>
          <button type="submit">Add Reading</button>
        </form>

        {readings.length > 0 && (
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
        )}
      </div>
    </div>
  )
}

export default App
