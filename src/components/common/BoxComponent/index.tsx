import Box from '@mui/material/Box';
import { AppButton } from 'components';

export default function BoxComponent() {
  return (
    <div style={{ width: '200px' }}>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {
            my: 3,
            width: '100%',
          },
          display: 'flex',
          width: '90%',
          flexFlow: 'row wrap',
          justifyContent: 'end',
        }}
        noValidate
        autoComplete="off"
      >
        <AppButton
          fullWidth={false}
          type="submit"
          sx={{ my: 2 }}
          title={'ADD CATEGORIES'}
        />
      </Box>
    </div>
  );
}
