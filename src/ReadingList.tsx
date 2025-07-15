import React from 'react'
import type { BPReading } from './App'

type Props = {
  readings: BPReading[]
  onExport: () => void
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ReadingList({ readings, onExport, onImport }: Props) {
  return (
    <div style={{ minWidth: 180, textAlign: 'left' }}>
      <h2 style={{ fontSize: 18, marginBottom: 8 }}>Readings</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {readings.map((r, i) => {
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
      <div style={{ marginTop: 16 }}>
        <label style={{ display: 'inline-block', cursor: 'pointer', marginRight: 8 }}>
          <span style={{ textDecoration: 'underline', color: '#0074d9' }} onClick={onExport}>Export</span>
        </label>
        <label style={{ display: 'inline-block', cursor: 'pointer' }}>
          <span style={{ textDecoration: 'underline', color: '#0074d9' }}>Import</span>
          <input
            type="file"
            accept=".txt"
            onChange={onImport}
            style={{ display: 'none' }}
          />
        </label>
      </div>
    </div>
  )
}
