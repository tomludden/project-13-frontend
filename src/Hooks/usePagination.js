import { useState, useEffect } from 'react'

export const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage))

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [data, totalPages, currentPage])

  const start = (currentPage - 1) * itemsPerPage
  const paginatedData = Array.isArray(data)
    ? data.slice(start, start + itemsPerPage)
    : []

  return {
    currentPage,
    totalPages,
    paginatedData,
    setPage: setCurrentPage
  }
}
