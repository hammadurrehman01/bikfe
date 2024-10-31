import { Stack, Typography } from '@mui/material';
import React from 'react';

interface Props {
  title: string;
}

const DataNotFound = ({ title }: Props) => {
  return (
    <Stack
      sx={{
        width: '100%',
        height: '80vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>
        The {title} is not available{' '}
      </Typography>
    </Stack>
  );
};

export default DataNotFound;
