import { forwardRef, InputHTMLAttributes } from 'react'

export interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

// this component will not inherit from 'Input' component
// because it will not recieve `register`, but recieve `onChange`
const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInputInner(
  {
    errorMessage,
    className,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    onChange,
    ...rest
  },
  ref
) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    // use 'regex' to check if is number
    // d: is number; $: end the regex
    if (/^\d+$/.test(value) || value === '') {
      onChange && onChange(event)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} onChange={handleChange} ref={ref} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default NumberInput
