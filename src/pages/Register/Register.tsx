import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'

import Input from '../../components/Input'
import { Schema, schema } from '../../utils/rules'
import { registerAccount } from '../../api/auth.api'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import { ErrorResponse } from '../../types/utils.type'
import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'
import Button from '../../components/Button'

// use this FormData as generic type to control type of data in form
// interface FormData {
//   email: string
//   password: string
//   confirm_password: string
// }

type FormData = Schema

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register, // register the value entered in input to 'react hook form'
    handleSubmit,
    //watch,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })

  // handleSubmit only runs when form data is valid
  const onSubmit = handleSubmit((data) => {
    // console.log(data)
    const body = omit(data, ['confirm_password']) // omit 'confirm_password' from form input data
    // console.log(body)
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        // console.log(data)
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        // console.log(error)
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          // console.log(error)
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }

          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }

          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
        }
      }
    })
  })

  // const value = watch()
  // console.log(value)
  // console.log('errors', errors)

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form onSubmit={onSubmit} className='p-10 rounded bg-white shadow-sm' noValidate>
              <div className='text-2xl'>Register</div>
              <Input
                name='email'
                register={register}
                type='email'
                className='mt-8'
                errorMessage={errors.email?.message}
                placeholder='Email'
                // rules={rules.email}
              />

              <Input
                name='password'
                register={register}
                type='password'
                className='mt-2'
                errorMessage={errors.password?.message}
                placeholder='Password'
                // rules={rules.password}
                autoComplete='on'
              />

              <Input
                name='confirm_password'
                register={register}
                type='password'
                className='mt-2'
                errorMessage={errors.confirm_password?.message}
                placeholder='Confirm Password'
                // rules={rules.confirm_password}
                autoComplete='on'
              />

              <div className='mt-2'>
                <Button
                  disabled={registerAccountMutation.isPending}
                  isLoading={registerAccountMutation.isPending}
                  type='submit'
                  className='flex justify-center items-center w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                >
                  Register
                </Button>
              </div>

              <div className='flex items-center justify-center mt-8'>
                <span className='text-gray-400'>Have an account?</span>
                <Link className='text-red-400 ml-1' to='/login'>
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
