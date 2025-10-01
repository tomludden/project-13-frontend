import { useState, useEffect, useMemo } from 'react'

export const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(data.length / itemsPerPage))
  }, [data.length, itemsPerPage])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [currentPage, totalPages])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return Array.isArray(data) ? data.slice(start, start + itemsPerPage) : []
  }, [data, currentPage, itemsPerPage])

  return {
    currentPage,
    totalPages,
    paginatedData,
    setPage: setCurrentPage
  }
}
