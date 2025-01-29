import { User } from '../types/user.type'

export const LocalStorageEventTarget = new EventTarget()

// access_token
export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

// user profile
export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

// clear local storage
export const clearLocalStorage = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')

  const clearLSEvent = new Event('clearLocalStorage')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}
