import axios, { AxiosError, AxiosInstance } from 'axios'
import HttpStatusCode from '../constants/httpStatusCode.enum'
import { toast } from 'react-toastify'
import { AuthResponse } from '../types/auth.type'
import { clearLocalStorage, getAccessTokenFromLS, setAccessTokenToLS, setProfileToLS } from './auth'
import path from '../constants/path'
import config from '../constants/config'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    // this accessToken will be retrieved from local storage, and save in RAM
    // When we need it, we can retrieve it faster than retrieving it from LS
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Add a request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        // console.log(response)
        const { url } = response.config
        // get access_token from response and save it to local storage
        if (url === path.login || url === path.register) {
          const data = response.data as AuthResponse

          // save access_token into RAM
          this.accessToken = data.data.access_token

          // save access_token into LS
          setAccessTokenToLS(this.accessToken)

          // save user profile to LS
          setProfileToLS(data.data.user)
        } else if (url === path.logout) {
          this.accessToken = ''
          clearLocalStorage()
        }
        return response
      },
      function (error: AxiosError) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        // console.log(error)
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message // take error.message if not have data.message
          toast.error(message)
        }

        if (error.response?.status !== HttpStatusCode.Unauthorized) {
          clearLocalStorage()
          // window.location.reload() // the same as F5 refresh the app
        }

        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
