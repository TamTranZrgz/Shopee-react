import NumberInput, { NumberInputProps } from '../NumberInput'

interface Props extends NumberInputProps {
  max?: number
  onIncrease?: (value: number) => void // for increase button
  onDecrease?: (value: number) => void // for decrease button
  onType?: (value: number) => void // for input
  classNameWrapper?: string
}

export default function QuantityController({
  max,
  onIncrease,
  onDecrease,
  onType,
  classNameWrapper = 'ml-10',
  value, // value will be controlled by his parent component
  ...rest
}: Props) {
  // Control action on number input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value) // convert input data from user to number, and it will not be an event
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }

    onType && onType(_value)
  }

  const increase = () => {
    let _value = Number(value) + 1
    if (max !== undefined && _value > max) {
      _value = max
    }
    onIncrease && onIncrease(_value)
  }

  const decrease = () => {
    let _value = Number(value) - 1
    if (_value < 1) {
      _value = 1
    }
    onDecrease && onDecrease(_value)
  }

  return (
    <div className={'flex items-center ' + classNameWrapper}>
      <button
        onClick={decrease}
        className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
        </svg>
      </button>
      <NumberInput
        className=''
        classNameError='hidden'
        classNameInput='h-8 w-14 border-b border-t border-gray-300 p-1 text-center outline-none'
        onChange={handleChange}
        value={value} // value is input data from user
        {...rest}
      />
      <button
        onClick={increase}
        className='flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  )
}
