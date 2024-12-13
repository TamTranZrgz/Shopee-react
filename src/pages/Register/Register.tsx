import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from '../../utils/rules'
import Input from '../../components/Input'

// use this FormData as generic type to control type of data in form
// interface FormData {
//   email: string
//   password: string
//   confirm_password: string
// }

type FormData = Schema

export default function Register() {
  const {
    register, // register the value entered in input to 'react hook form'
    handleSubmit,
    //watch,
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  // const rules = getRules(getValues)

  // handleSubmit only runs when form is valis
  const onSubmit = handleSubmit(
    (data) => {},
    (data) => {
      const password = getValues('password')
      console.log(password) // form data
    }
  )

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
