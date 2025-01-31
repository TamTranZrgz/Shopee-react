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

// create function to re-use for validation of 'price_max' and 'price_min'
function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required(MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED)
    .min(6, MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_160_CHARACTERS)
    .max(160, MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_160_CHARACTERS)
    .oneOf([yup.ref(refString)], MESSAGES.CONFIRM_PASSWORD_DOES_NOT_MATCH)
}

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
  confirm_password: handleConfirmPasswordYup('password'),
  price_min: yup.string().test({
    name: 'price-not-allowed', // name of test
    message: 'Gia khong phu hop',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed', // name of test
    message: 'Gia khong phu hop',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required(MESSAGES.PRODUCT_NAME_IS_REQUIRED)
})

// omit `confirm_password` field from main schema to get schema for 'login' form
const loginSchema = schema.omit(['confirm_password'])

// use 'type' to transmit data type, can not transmit 'object' as data type
export type Schema = yup.InferType<typeof schema>

export type LoginSchema = yup.InferType<typeof loginSchema>

export const userSchema = yup.object({
  name: yup.string().max(160, 'Do dai toi da la 160 ky tu'),
  phone: yup.string().max(20, 'Do dai toi da la 20 ky tu'),
  address: yup.string().max(160, 'Do dai toi da la 160 ky tu'),
  avatar: yup.string().max(1000, 'Do dai toi da la 1000 ky tu'),
  date_of_birth: yup.date().max(new Date(), 'Hay chon mot ngay trong qua khu'),
  password: schema.fields['password'],
  new_password: schema.fields['password'],
  confirm_password: handleConfirmPasswordYup('new_password')
})

export type UserSchema = yup.InferType<typeof userSchema>
