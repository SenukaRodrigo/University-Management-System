import { useState, useCallback } from 'react'

// Per-field validation state for forms: { value, touched, error }.
//
// Timing rules:
//   - validate when the field is left (blur) — that's when it becomes "touched"
//   - after that, re-validate on every keystroke so the error clears as soon
//     as the input becomes valid
//   - an untouched field NEVER shows an error
//
// `isValid` is always computed (touched or not) so the submit button can be
// disabled without prematurely showing error messages.
export default function useField(validate, initial = '') {
  const [value, setValue] = useState(initial)
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState(null)

  const onChange = useCallback(e => {
    const next = e.target.value
    setValue(next)
    if (touched) setError(validate(next))
  }, [touched, validate])

  const onBlur = useCallback(() => {
    setTouched(true)
    setError(validate(value))
  }, [validate, value])

  return {
    value,
    error,
    isValid: validate(value) === null,
    onChange,
    onBlur,
  }
}
