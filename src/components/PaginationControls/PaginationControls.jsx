import './PaginationControls.css'

const PaginationControls = ({ currentPage, totalPages, goPrev, goNext }) => {
  if (totalPages <= 1) return null

  return (
    <div className='pagination'>
      <button onClick={goPrev} disabled={currentPage === 1}>
        Prev
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={goNext} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  )
}

export default PaginationControls
