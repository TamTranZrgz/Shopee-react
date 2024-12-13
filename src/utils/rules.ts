import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import { MESSAGES } from '../constants/message'
import * as yup from 'yup'

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
      message: MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_160_CHARACTERS
    },
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || MESSAGES.CONFIRM_PASSWORD_DOES_NOT_MATCH
        : undefined
  }
})

// this schema can be considered as main schema, and can be used for different form validation, by `obmit` some fields if not neccessary
export const schema = yup.object({
  email: yup
    .string()
    .required(MESSAGES.EMAIL_IS_REQUIRED)
    .email(MESSAGES.EMAIL_IS_NOT_VALID)
    .min(5, MESSAGES.EMAIL_LENGTH_MUST_BE_FROM_5_TO_160_CHARACTERS)
    .max(160, MESSAGES.EMAIL_LENGTH_MUST_BE_FROM_5_TO_160_CHARACTERS),
  password: yup
    .string()
    .required(MESSAGES.PASSWORD_IS_REQUIRED)
    .min(6, MESSAGES.PASSWORSD_LENGTH_MUST_BE_FROM_6_TO_160_CHARACTERS)
    .max(160, MESSAGES.PASSWORSD_LENGTH_MUST_BE_FROM_6_TO_160_CHARACTERS),
  confirm_password: yup
    .string()
    .required(MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED)
    .min(6, MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_160_CHARACTERS)
    .max(160, MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_160_CHARACTERS)
    .oneOf([yup.ref('password')], MESSAGES.CONFIRM_PASSWORD_DOES_NOT_MATCH)
})

// omit `confirm_password` field from main schema to get schema for 'login' form
const loginSchema = schema.omit(['confirm_password'])

export type Schema = yup.InferType<typeof schema>

export type LoginSchema = yup.InferType<typeof loginSchema>
