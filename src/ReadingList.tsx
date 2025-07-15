import React from 'react'
import type { BPReading } from './App'

type Props = {
  readings: BPReading[]
  onExport: () => void
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
}

// Helper to determine background color for a reading
function getReadingBgColor(systolic: number, diastolic: number) {
  if (systolic < 90 || diastolic < 60) return '#82b6ff' // Low - blue
  if (systolic >= 135 || diastolic >= 85) return '#ffb3b3' // High - red
  if (
    (systolic >= 120 && systolic <= 134) ||
    (diastolic >= 80 && diastolic <= 84)
  )
    return '#ffe082' // Slightly raised - yellow/orange
  if (
    (systolic >= 90 && systolic <= 119) &&
    (diastolic >= 60 && diastolic <= 79)
  )
    return '#81e88b' // Healthy - green
  return '#fff'
}

export default function ReadingList({ readings, onExport, onImport }: Props) {
  return (
    <div
      style={{
        minWidth: 210,
        textAlign: 'left',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px 0 rgba(60,60,60,0.06)',
        padding: 20,
        marginTop: 0,
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2 style={{ fontSize: 20, marginBottom: 14, color: '#0074d9', letterSpacing: 1 }}>Readings</h2>
      <div
        style={{
          overflowY: 'auto',
          flex: 1,
          minHeight: 0,
          scrollbarWidth: 'thin',
          scrollbarColor: '#0074d9 #eaeaea',
        } as React.CSSProperties}
        className="pretty-scrollbar"
      >
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {readings.map((r, i) => {
            const [year, month, day] = r.date.split('-')
            const formattedDate = `${day}/${month}/${year}`
            const timeLabel = r.timeOfDay === 'morning' ? 'AM' : 'PM'
            const bgColor = getReadingBgColor(r.systolic, r.diastolic)
            return (
              <li
                key={i}
                style={{
                  // marginBottom: 10, // Removed vertical gap
                  fontSize: 15,
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: 7,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: bgColor,
                  borderRadius: 6,
                  paddingLeft: 10,
                  paddingRight: 10,
                  boxShadow: bgColor !== '#fff' ? '0 1px 4px 0 rgba(60,60,60,0.04)' : undefined,
                  fontWeight: 500,
                  color: '#222',
                  // Remove top/bottom margin for first/last
                  marginTop: 0,
                  marginBottom: 0,
                }}
              >
                <span>{formattedDate} {timeLabel}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{r.systolic}/{r.diastolic}</span>
              </li>
            )
          })}
        </ul>
      </div>
      <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
        <label style={{ display: 'inline-block', cursor: 'pointer', marginRight: 8 }}>
          <span style={{ textDecoration: 'underline', color: '#0074d9', fontWeight: 500 }} onClick={onExport}>Export</span>
        </label>
        <label style={{ display: 'inline-block', cursor: 'pointer' }}>
          <span style={{ textDecoration: 'underline', color: '#0074d9', fontWeight: 500 }}>Import</span>
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
