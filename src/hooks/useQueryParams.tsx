import { useSearchParams } from 'react-router'

// function to retrieve query params on URL
export default function useQueryParams() {
  const [searchParams] = useSearchParams()
  return Object.fromEntries([...searchParams])
}
