import { Product, ProductList, ProductListConfig } from '../types/product.type'
import { SuccessResponse } from '../types/utils.type'
import http from '../utils/https'

const URL = 'products'
const productApi = {
  getProducts(params: ProductListConfig) {
    // type of returned data will be ProductList which will be data for SuccessResponse()
    return http.get<SuccessResponse<ProductList>>(URL, {
      params
    })
  },

  getProductDetails(id: string) {
    // type of returned data will be Product which will be data for SuccessResponse()
    return http.get<SuccessResponse<Product>>(`${URL}/${id}`)
  }
}

export default productApi
