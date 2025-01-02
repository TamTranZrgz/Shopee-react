import { useForm } from 'react-hook-form'
import useQueryConfig from './useQueryConfig'
import { yupResolver } from '@hookform/resolvers/yup'
import { Schema, schema } from '../utils/rules'
import { omit } from 'lodash'
import { createSearchParams, useNavigate } from 'react-router'
import path from '../constants/path'

type FormData = Pick<Schema, 'name'>

const nameSchema = schema.pick(['name'])

export default function useSearchProducts() {
  const navigate = useNavigate()

  // get query params from url
  const queryConfig = useQueryConfig()
  // console.log(queryConfig)

  // use react-hook-form to get useForm
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })

  // handle search
  const handleSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.name
        }

    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })

  return { handleSearch, register }
}
