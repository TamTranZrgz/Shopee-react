import http from '../utils/https'
import { Category } from '../types/category.type'
import { SuccessResponse } from '../types/utils.type'

const URL = 'categories'

const categoryApi = {
  getCategories() {
    return http.get<SuccessResponse<Category[]>>(URL)
  }
}

export default categoryApi
