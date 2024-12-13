import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import { MESSAGES } from '../constants/message'

type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }

// getRuless is an arrow function which will return an object
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: MESSAGES.EMAIL_IS_REQUIRED
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: MESSAGES.EMAIL_IS_NOT_VALID
    },
    maxLength: {
      value: 160,
      message: MESSAGES.EMAIL_LENGTH_MUST_BE_FROM_5_TO_160_CHARACTERS
    },
    minLength: {
      value: 5,
      message: MESSAGES.EMAIL_LENGTH_MUST_BE_FROM_5_TO_160_CHARACTERS
    }
  },
  password: {
    required: {
      value: true,
      message: MESSAGES.PASSWORD_IS_REQUIRED
    },
    maxLength: {
      value: 160,
      message: MESSAGES.PASSWORSD_LENGTH_MUST_BE_FROM_6_TO_160_CHARACTERS
    },
    minLength: {
      value: 6,
      message: MESSAGES.PASSWORSD_LENGTH_MUST_BE_FROM_6_TO_160_CHARACTERS
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
    },
    maxLength: {
      value: 160,
      message: MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_160_CHARACTERS
    },
    minLength: {
      value: 6,
      message: MESSAGES.CONFIRM_PASSWORD_DOES_NOT_MATCH
    },
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || MESSAGES.CONFIRM_PASSWORD_DOES_NOT_MATCH
        : undefined
  }
})
