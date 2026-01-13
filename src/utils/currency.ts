// Utility function for handling currency input with $ symbol
export const handleCurrencyInput = (
  inputValue: string,
  setValue: (value: string) => void
) => {
  // Remove $ symbol
  let value = inputValue.replace(/\$/g, '')
  
  // Only allow numbers and one decimal point
  if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
    setValue(value)
  }
}

// Format display value with $ symbol
export const formatCurrencyInput = (value: string | number): string => {
  if (!value || value === '') return ''
  return `$${value}`
}