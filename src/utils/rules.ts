import type { RegisterOptions } from 'react-hook-form'
type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }

export const rules: Rules = {
  email: {
    required: {
      value: true,
      message: 'Email is required'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email is not valid'
    },
    maxLength: {
      value: 160,
      message: 'Email length must be from 5 - 160 chracters'
    },
    minLength: {
      value: 5,
      message: 'Email length must be from 5 - 160 chracters'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password is required'
    },
    maxLength: {
      value: 160,
      message: 'Password length must be from 6 - 160 chracters'
    },
    minLength: {
      value: 6,
      message: 'Password length must be from 6 - 160 chracters'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Confirm password is required'
    },
    maxLength: {
      value: 160,
      message: 'Confirm password length must be from 6 - 160 chracters'
    },
    minLength: {
      value: 6,
      message: 'Confirm password length must be from 6 - 160 chracters'
    }
  }
}
