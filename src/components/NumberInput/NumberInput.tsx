import { forwardRef, InputHTMLAttributes, useState } from 'react'

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
    value = '',
    ...rest
  },
  ref
) {
  // in case user not enter any value, or pass 'onChange', and this 'value' only works for the first render
  const [localValue, setLocalValue] = useState<string>(value as string)

  // if there is 'onChange'
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    // use 'regex' to check if is number
    // d: is number; $: end the regex
    if (/^\d+$/.test(value) || value === '') {
      // Implement onChange callback from outside pass to props
      onChange && onChange(event)

      // Update localValue state
      setLocalValue(value)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} onChange={handleChange} value={value || localValue} ref={ref} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default NumberInput
