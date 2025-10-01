import React, { useMemo, useCallback } from 'react'
import './PaginationControls.css'

const PaginationControls = ({ currentPage, totalPages, goPrev, goNext }) => {
  if (totalPages <= 1) return null

  const isFirstPage = useMemo(() => currentPage === 1, [currentPage])
  const isLastPage = useMemo(
    () => currentPage === totalPages,
    [currentPage, totalPages]
  )

  const handlePrev = useCallback(() => {
    if (!isFirstPage) goPrev()
  }, [isFirstPage, goPrev])

  const handleNext = useCallback(() => {
    if (!isLastPage) goNext()
  }, [isLastPage, goNext])

  return (
    <div className='pagination'>
      <button onClick={handlePrev} disabled={isFirstPage}>
        Prev
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={handleNext} disabled={isLastPage}>
        Next
      </button>
    </div>
  )
}

export default PaginationControls
