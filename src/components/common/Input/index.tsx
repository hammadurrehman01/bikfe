import { TextField, TextFieldProps } from '@mui/material';
import { memo } from 'react';

type ExtendedTextFieldProps = TextFieldProps & {
  error?: boolean;
  disabled?: boolean;
  inputType?: any;
};

function InputComponent({
  name,
  inputType,
  error,
  label,
  helperText,
  placeholder,
  margin = 'normal',
  variant = 'outlined',
  disabled,
  ...rest
}: ExtendedTextFieldProps) {
  return (
    <TextField
      type={inputType}
      fullWidth
      {...{
        error: Boolean(error),
        name,
        label,
        margin,
        variant,
        helperText,
        placeholder,
        disabled,
      }}
      {...rest}
    />
  );
}

export const Input = memo(InputComponent);
