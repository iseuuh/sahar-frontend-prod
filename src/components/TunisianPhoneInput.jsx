// src/components/TunisianPhoneInput.jsx
import React from 'react'

const TunisianPhoneInput = ({ value, onChange }) => {
  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 8)
    onChange(val)
  }

  return (
    <div className="flex items-center">
      <span className="px-3 py-2 bg-gray-200 rounded-l text-gray-700 text-sm border border-r-0 border-gray-300">
        +216
      </span>
      <input
        type="tel"
        className="border border-gray-300 rounded-r p-2 w-full focus:outline-none focus:border-pink-500"
        placeholder="Numéro (8 chiffres)"
        value={value}
        onChange={handleChange}
        maxLength={8}
        pattern="[0-9]{8}"
        required
        autoComplete="tel"
      />
    </div>
  )
}

export default TunisianPhoneInput
