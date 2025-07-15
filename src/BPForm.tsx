import React, { useState } from 'react'
import type { BPReading } from './App'

type Props = {
  setReadings: React.Dispatch<React.SetStateAction<BPReading[]>>
}

export default function BPForm({ setReadings }: Props) {
  const [date, setDate] = useState('')
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'evening'>('morning')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !systolic || !diastolic || !timeOfDay) return
    setReadings(prev => [
      ...prev,
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

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: 20,
        background: '#f7fafd',
        borderRadius: 10,
        padding: 14,
        boxShadow: '0 1px 4px 0 rgba(60,60,60,0.04)',
        maxWidth: 340,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
        <label style={{ minWidth: 90, fontWeight: 500, textAlign: 'left', marginRight: 10 }}>
          Date:
        </label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', flex: 1 }}
        />
      </div>
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
        <label style={{ minWidth: 90, fontWeight: 500, textAlign: 'left', marginRight: 10 }}>
          Systolic:
        </label>
        <input
          type="number"
          value={systolic}
          onChange={e => setSystolic(e.target.value)}
          required
          min={50}
          max={250}
          style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', flex: 1 }}
        />
      </div>
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
        <label style={{ minWidth: 90, fontWeight: 500, textAlign: 'left', marginRight: 10 }}>
          Diastolic:
        </label>
        <input
          type="number"
          value={diastolic}
          onChange={e => setDiastolic(e.target.value)}
          required
          min={30}
          max={150}
          style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', flex: 1 }}
        />
      </div>
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
        <label style={{ minWidth: 90, fontWeight: 500, textAlign: 'left', marginRight: 10 }}>
          Time of Day:
        </label>
        <select
          value={timeOfDay}
          onChange={e => setTimeOfDay(e.target.value as 'morning' | 'evening')}
          required
          style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', flex: 1 }}
        >
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
        </select>
      </div>
      <button
        type="submit"
        style={{
          background: '#0074d9',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '8px 20px',
          fontWeight: 600,
          fontSize: 16,
          cursor: 'pointer',
          marginTop: 6,
          boxShadow: '0 1px 4px 0 rgba(60,60,60,0.04)',
          width: '100%',
        }}
      >
        Add Reading
      </button>
    </form>
  )
}
