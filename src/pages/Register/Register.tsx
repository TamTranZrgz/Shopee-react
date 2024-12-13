import { Link } from 'react-router'
import { RegisterOptions, useForm } from 'react-hook-form'
import { getRules } from '../../utils/rules'
import { MESSAGES } from '../../constants/message'

// use this FormData as generic type to control type of data in form
interface FormData {
  email: string
  password: string
  confirm_password: string
}

export default function Register() {
  const {
    register, // register the value entered in input to 'react hook form'
    handleSubmit,
    //watch,
    getValues,
    formState: { errors }
  } = useForm<FormData>()

  const rules = getRules(getValues)

  // handleSubmit only runs when form is valis
  const onSubmit = handleSubmit(
    (data) => {},
    (data) => {
      const password = getValues('password')
      console.log(password) // form data
    }
  )

  // const email = watch('email')
  // console.log(email)
  // console.log('errors', errors)
  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form onSubmit={onSubmit} className='p-10 rounded bg-white shadow-sm' noValidate>
              <div className='text-2xl'>Register</div>
              <div className='mt-8'>
                <input
                  type='email'
                  className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  placeholder='Email'
                  {...register('email', rules.email as RegisterOptions<FormData, 'email'>)}
                />
                <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errors.email?.message}</div>
              </div>
              <div className='mt-2'>
                <input
                  type='password'
                  className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  placeholder='Password'
                  autoComplete='on'
                  {...register('password', rules.password as RegisterOptions<FormData, 'password'>)}
                />
                <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errors.password?.message}</div>
              </div>
              <div className='mt-2'>
                <input
                  type='password'
                  className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  placeholder='Confirm Password'
                  autoComplete='on'
                  {...register(
                    'confirm_password',
                    rules.confirm_password as RegisterOptions<FormData, 'confirm_password'>
                  )}
                />
                <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errors.confirm_password?.message}</div>
              </div>
              <div className='mt-2'>
                <button
                  type='submit'
                  className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                >
                  Register
                </button>
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
