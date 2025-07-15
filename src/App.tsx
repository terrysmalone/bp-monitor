import { useState, useEffect } from 'react'
import './App.css'
import ReadingList from './ReadingList'
import BPForm from './BPForm'
import BPGraph from './BPGraph'
import TimelineGraph from './TimelineGraph'

export type BPReading = {
  date: string
  systolic: number
  diastolic: number
  timeOfDay: 'morning' | 'evening'
}

const maxSys = 170
const minSys = 0
const maxDia = 100
const minDia = 0
const graphHeight = 420
const graphWidth = 820
const padding = 30

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

function App() {
  const [readings, setReadings] = useState<BPReading[]>(() => {
    const stored = localStorage.getItem('bp-readings')
    return stored ? JSON.parse(stored) : []
  })
  const [graphFilter, setGraphFilter] = useState<'all' | 'morning' | 'evening'>('all')

  useEffect(() => {
    localStorage.setItem('bp-readings', JSON.stringify(readings))
  }, [readings])

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

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
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
      setReadings(imported)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const sortedReadings = [...readings].sort((a, b) => {
    if (a.date === b.date) {
      if (a.timeOfDay === b.timeOfDay) return 0
      return a.timeOfDay === 'evening' ? -1 : 1
    }
    return b.date.localeCompare(a.date)
  })

  const filteredReadings =
    graphFilter === 'all'
      ? readings
      : readings.filter(r => r.timeOfDay === graphFilter)

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '2rem auto',
        padding: 24,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 40,
        background: '#f4f8fb',
        borderRadius: 16,
        boxShadow: '0 4px 24px 0 rgba(60,60,60,0.08)',
        flexDirection: 'column',
      }}
    >
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: '#0074d9',
          margin: 0,
          marginBottom: 2,
          letterSpacing: 1,
          textAlign: 'center',
          width: '100%',
        }}
      >
        Blood pressure tracker
      </h1>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, width: '100%' }}>
        {/* Left column: BPForm above ReadingList */}
        <div style={{ minWidth: 260, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <BPForm setReadings={setReadings} />
          <ReadingList
            readings={sortedReadings}
            onExport={handleExport}
            onImport={handleImport}
          />
        </div>
        {/* Right column: Graphs */}
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px 0 rgba(60,60,60,0.06)', padding: 24 }}>
          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ fontWeight: 500, color: '#444', marginRight: 8 }}>Show:</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                type="radio"
                value="all"
                checked={graphFilter === 'all'}
                onChange={() => setGraphFilter('all')}
                style={{ accentColor: '#0074d9' }}
              />
              All
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                type="radio"
                value="morning"
                checked={graphFilter === 'morning'}
                onChange={() => setGraphFilter('morning')}
                style={{ accentColor: '#0074d9' }}
              />
              Morning
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                type="radio"
                value="evening"
                checked={graphFilter === 'evening'}
                onChange={() => setGraphFilter('evening')}
                style={{ accentColor: '#0074d9' }}
              />
              Evening
            </label>
          </div>
          {readings.length > 0 && (
            <>
              <div style={{ background: '#f9f9f9', borderRadius: 10, padding: 16, boxShadow: '0 1px 4px 0 rgba(60,60,60,0.04)' }}>
                <BPGraph
                  readings={filteredReadings}
                  maxSys={maxSys}
                  minSys={minSys}
                  maxDia={maxDia}
                  minDia={minDia}
                  graphHeight={graphHeight}
                  graphWidth={graphWidth}
                  padding={padding}
                  categories={categories}
                />
              </div>
              <div style={{ marginTop: 32, background: '#fafbfc', borderRadius: 10, padding: 16, boxShadow: '0 1px 4px 0 rgba(60,60,60,0.04)' }}>
                <TimelineGraph
                  readings={filteredReadings}
                  graphHeight={180}
                  graphWidth={400}
                  padding={30}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
