import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from './use-debounce'
import { Product } from '@/types/product.types'

interface UseSearchProps {
  items: Product[]
  searchDelay?: number
}

export function useSearch({ items, searchDelay = 300 }: UseSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredItems, setFilteredItems] = useState(items)
  const [isSearching, setIsSearching] = useState(false)
  
  const debouncedSearchTerm = useDebounce(searchTerm, searchDelay)

  const searchItems = useCallback(
    (term: string) => {
      if (!term.trim()) {
        return items
      }

      const searchLower = term.toLowerCase()
      return items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower)
      )
    },
    [items]
  )

  useEffect(() => {
    setIsSearching(true)
    const results = searchItems(debouncedSearchTerm)
    setFilteredItems(results)
    setIsSearching(false)
  }, [debouncedSearchTerm, searchItems])

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    isSearching,
  }
} 