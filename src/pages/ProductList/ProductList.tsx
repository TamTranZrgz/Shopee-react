import { useQuery, keepPreviousData } from '@tanstack/react-query'

import AsideFilter from './components/AsideFilter'
import productApi from '../../api/product.api'
import Pagination from '../../components/Pagination'
import { ProductListConfig } from '../../types/product.type'
import categoryApi from '../../api/category.api'
import SortProductList from './components/SortProductList'
import Product from './components/Product'
import useQueryConfig from '../../hooks/useQueryConfig'

export default function ProductList() {
  // useQueryConfig is a customized hook that config all query params of URL
  const queryConfig = useQueryConfig()

  // For product listing
  const { data: productsData } = useQuery({
    // queryParams will be retrieved from url
    // when we change value of an option on UI of ProductList page, value of related param on URL will also be change
    // when URL changes, ProductList can listen to the change, useQuery will call new again, and we will have new data
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000 // 3 minutes
  })

  // For category listing on asideFilter
  const { data: categoriesData } = useQuery({
    // queryParams will be retrieved from url
    // when we change value of an option on UI of ProductList page, value of related param on URL will also be change
    // when URL changes, ProductList can listen to the change, useQuery will call new again, and we will have new data
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  // console.log(productsData)
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        {productsData && (
          <div className='grid grid-cols-12 gap-6'>
            {/* Aside Filter */}
            <div className='col-span-3'>
              <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
            </div>
            {/* Aside Filter */}

            {/* Product Grid */}
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
            </div>
            {/* Product Grid */}
          </div>
        )}
      </div>
    </div>
  )
}
