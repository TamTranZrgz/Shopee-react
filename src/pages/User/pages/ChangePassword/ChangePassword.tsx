import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { omit } from 'lodash'

import Button from '../../../../components/Button'
import Input from '../../../../components/Input'
import { userSchema, UserSchema } from '../../../../utils/rules'
import userApi from '../../../../api/user.api'
import { isAxiosUnprocessableEntityError } from '../../../../utils/utils'
import { ErrorResponse, NoUndefinedField } from '../../../../types/utils.type'
import { ObjectSchema } from 'yup'

type FormData = NoUndefinedField<Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>>
const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

export default function ChangePassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver<FormData>(passwordSchema as ObjectSchema<FormData>)
  })

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })

  const onSubmit = handleSubmit(async (data) => {
    // console.log(data)
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message)
      reset()
    } catch (error) {
      // console.log(error)
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        // console.log(error)
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Đổi mật khẩu</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>

      <form className='mr-auto mt-8 max-w-2xl' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mật khẩu cu</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                className='relative'
                name='password'
                type='password'
                placeholder='Mat khau cu'
                errorMessage={errors.password?.message}
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              />
            </div>
          </div>

          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mật khẩu moi</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                className='relative'
                name='new_password'
                type='password'
                placeholder='Mat khau moi'
                errorMessage={errors.new_password?.message}
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              />
            </div>
          </div>

          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Nhap lai mật khẩu moi</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                className='relative'
                name='confirm_password'
                type='password'
                placeholder='Nhap lai mật khẩu moi'
                errorMessage={errors.confirm_password?.message}
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              />
            </div>
          </div>

          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                type='submit'
                className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
              >
                Luu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
