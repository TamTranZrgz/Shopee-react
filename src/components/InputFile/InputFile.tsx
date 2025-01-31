import { useRef, Fragment } from 'react'
import config from '../../constants/config'
import { toast } from 'react-toastify'

interface Props {
  onChange?: (file?: File) => void
}

export default function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // const [file, setFile] = useState<File>()

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    // console.log(fileFromLocal)
    if (fileFromLocal && (fileFromLocal.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
      // console.log(fileFromLocal)
      toast.error('Dụng lượng file tối đa 1 MB hoac Định dạng .JPEG, .PNG', {
        position: 'top-center'
      })
    } else {
      onChange && onChange(fileFromLocal)
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <Fragment>
      <input
        type='file'
        accept='.jpg,.jpeg,.png'
        className='hidden'
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(event) => {
          ;(event.target as any).value = null
        }}
      />
      <button
        type='button'
        onClick={handleUpload}
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
      >
        Chon anh
      </button>
    </Fragment>
  )
}
