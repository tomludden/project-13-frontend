import React from 'react'
import './SearchBar.css'

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className='search-bar'>
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {value && (
        <span
          className='clear-search'
          onClick={() => onChange({ target: { value: '' } })}
        >
          &times;
        </span>
      )}
    </div>
  )
}

export default SearchBar
