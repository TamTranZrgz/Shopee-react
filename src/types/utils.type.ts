// It's a general interface for all api. When user calls an api, will transmit 'Data', and return 'message' and 'data'
// export interface ApiResponse<Data> {
//   message: string
//   data?: Data
// }

// Seperate above interface into two different interface :

export interface SuccessResponse<Data> {
  message: string
  data: Data
}

export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

// syntax '-?' : exclude/omit undefined key of key with optional ( key with ?)
export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
