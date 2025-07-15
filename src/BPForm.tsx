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
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 10 }}>
        <label style={{ marginRight: 8 }}>
          Date:
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ marginRight: 8 }}>
          Systolic:
          <input
            type="number"
            value={systolic}
            onChange={e => setSystolic(e.target.value)}
            required
            min={50}
            max={250}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ marginRight: 8 }}>
          Diastolic:
          <input
            type="number"
            value={diastolic}
            onChange={e => setDiastolic(e.target.value)}
            required
            min={30}
            max={150}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ marginRight: 8 }}>
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
  )
}
