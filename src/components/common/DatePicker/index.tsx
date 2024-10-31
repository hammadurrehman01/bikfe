import { SxProps, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';

interface IProps {
  value: any;
  onChange: (newValue: any) => void;
  sx?: SxProps;
}

export const CustomizeDatePicker = (props: IProps) => {
  const { value, onChange, sx } = props;
  const [open, setOpen] = useState(false);

  const handleOpenDatePicker = () => {
    setOpen(true);
  };

  const handleCloseDatePicker = () => {
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        open={open}
        value={value}
        onChange={onChange}
        inputFormat="DD-MM-YYYY"
        onClose={handleCloseDatePicker}
        renderInput={params => (
          <TextField
            onClick={handleOpenDatePicker}
            sx={{
              width: '50%',
              marginTop: '20px',
              '.MuiOutlinedInput-notchedOutline': {
                border: '1px solid #88888a !important',
              },
              ...sx,
            }}
            autoComplete="off"
            {...params}
          />
        )}
      />
    </LocalizationProvider>
  );
};
