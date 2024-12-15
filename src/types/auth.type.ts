// contain interfaces or types related to authentication

import { User } from './user.type'
import { ApiResponse } from './utils.type'

// This 'AuthResponse' will have form of ApiResponse but with more concrete info - object (access_token, expires, user)
export type AuthResponse = ApiResponse<{
  access_token: string
  expires: string
  user: User
}>

// const auth: AuthResponse = {
//   message: 'sdd',
//   data: {
//     access_token: 'ssd',
//     expires: 'dsd',
//     user: User
//   }
// }
