import path from '../constants/path'
import { AuthResponse } from '../types/auth.type'
import http from '../utils/https'

// define the type of reponse as AuthResponse after calling register api
export const registerAccount = (body: { email: string; password: string }) =>
  http.post<AuthResponse>(path.register, body)

export const login = (body: { email: string; password: string }) => http.post<AuthResponse>(path.login, body)

export const logout = () => http.post(path.logout)
