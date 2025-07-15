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
  )
}
