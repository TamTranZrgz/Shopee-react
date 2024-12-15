// It's a general interface for all api. When user calls an api, will transmit 'Data', and return 'message' and 'data'
export interface ApiResponse<Data> {
  message: string
  data?: Data
}
