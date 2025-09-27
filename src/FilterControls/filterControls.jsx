import React from 'react'
import './filterControls.css'

const FilterControls = ({
  size,
  setSize,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  clearFilters
}) => (
  <div className='filter'>
    <select
      className='select'
      value={size}
      onChange={(e) => setSize(e.target.value)}
    >
      <option value=''>Dog Size</option>
      <option value='small'>Small</option>
      <option value='medium'>Medium</option>
      <option value='large'>Large</option>
    </select>

    <input
      className='input'
      type='number'
      placeholder='Max Price'
      value={maxPrice}
      onChange={(e) => setMaxPrice(e.target.value)}
    />

    <select
      className='select'
      value={minRating}
      onChange={(e) => setMinRating(e.target.value)}
    >
      <option value=''>Rating</option>
      <option value='1'>⭐ 1+</option>
      <option value='2'>⭐ 2+</option>
      <option value='3'>⭐ 3+</option>
      <option value='4'>⭐ 4+</option>
    </select>

    <button className='filter-button' onClick={clearFilters}>
      Clear Filters
    </button>
  </div>
)

export default FilterControls
