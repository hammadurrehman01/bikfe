import { memo } from 'react';
import { Box, CircularProgress, SxProps, Theme } from '@mui/material';

interface Props {
  sx?: SxProps<Theme>;
  size?: number;
}

const AppLoaderComponent = ({ sx, size = 40 }: Props) => {
  const style: SxProps<Theme> = sx
    ? sx
    : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      };

  return (
    <Box sx={style}>
      <CircularProgress size={size} />
    </Box>
  );
};

export const AppLoader = memo(AppLoaderComponent);
