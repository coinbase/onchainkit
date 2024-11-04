import { useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce.js';
import { jsx } from 'react/jsx-runtime';
function TextInput({
  'aria-label': ariaLabel,
  className,
  delayMs,
  disabled = false,
  onBlur,
  onChange,
  placeholder,
  setValue,
  value,
  inputValidator = () => true
}) {
  const handleDebounce = useDebounce(value => {
    onChange(value);
  }, delayMs);
  const handleChange = useCallback(evt => {
    const value = evt.target.value;
    if (inputValidator(value)) {
      setValue(value);
      if (delayMs > 0) {
        handleDebounce(value);
      } else {
        onChange(value);
      }
    }
  }, [onChange, handleDebounce, delayMs, setValue, inputValidator]);
  return /*#__PURE__*/jsx("input", {
    "aria-label": ariaLabel,
    "data-testid": "ockTextInput_Input",
    type: "text",
    className: className,
    placeholder: placeholder,
    value: value,
    onBlur: onBlur,
    onChange: handleChange,
    disabled: disabled
  });
}
export { TextInput };
//# sourceMappingURL=TextInput.js.map
