import { omitBy, isUndefined } from 'lodash'
import useQueryParams from './useQueryParams'
import { ProductListConfig } from '../types/product.type'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function useQueryConfig() {
  // 'useQueryParams' is a customed hook to retrieve query params from url
  // queryParams will be always string (get from URL)
  const queryParams: QueryConfig = useQueryParams()

  // 'omitBy' will exclude queries that have undefined value
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '20',
      sort_by: queryParams.sort_by,
      excluded: queryParams.excluded,
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      category: queryParams.category
    },
    isUndefined
  )
  return queryConfig
}
