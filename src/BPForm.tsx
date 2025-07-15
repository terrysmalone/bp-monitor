import React, { useState } from 'react'
import type { BPReading } from './App'

type Props = {
  setReadings: React.Dispatch<React.SetStateAction<BPReading[]>>
}

const MIN_SYS = 0
const MAX_SYS = 170
const MIN_DIA = 0
const MAX_DIA = 100

function isValidDate(date: string) {
  if (!date) return false
  // Check format YYYY-MM-DD and that it's a valid date
  const [year, month, day] = date.split('-').map(Number)
  if (!year || !month || !day) return false
  const d = new Date(date)
  return (
    d instanceof Date &&
    !isNaN(d.getTime()) &&
    d.getFullYear() === year &&
    d.getMonth() + 1 === month &&
    d.getDate() === day
  )
}

export default function BPForm({ setReadings }: Props) {
  const [date, setDate] = useState('')
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'evening'>('morning')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate date
    if (!isValidDate(date)) {
      setError('Please enter a valid date.')
      return
    }

    // Validate systolic
    const sys = Number(systolic)
    if (isNaN(sys) || sys < MIN_SYS || sys > MAX_SYS) {
      setError(`Systolic must be between ${MIN_SYS} and ${MAX_SYS}.`)
      return
    }

    // Validate diastolic
    const dia = Number(diastolic)
    if (isNaN(dia) || dia < MIN_DIA || dia > MAX_DIA) {
      setError(`Diastolic must be between ${MIN_DIA} and ${MAX_DIA}.`)
      return
    }

    // Validate timeOfDay
    if (!timeOfDay) {
      setError('Please select time of day.')
      return
    }

    setReadings(prev => [
      ...prev,
      {
        date,
        systolic: sys,
        diastolic: dia,
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
          min={MIN_SYS}
          max={MAX_SYS}
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
          min={MIN_DIA}
          max={MAX_DIA}
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
      {error && (
        <div style={{ color: '#e74c3c', marginBottom: 8, marginTop: 2, fontSize: 14 }}>
          {error}
        </div>
      )}
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
