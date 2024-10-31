import { Stack, SxProps } from '@mui/material';
import { useMemo } from 'react';
import { TableSkeletonRow } from 'components/common/TableSkeletonRow';

interface Props {
  numberOfRows: number;
  sx?: SxProps;
}

const TableSkeleton = ({ numberOfRows, sx }: Props) => {
  const showRows = () =>
    Array.from({ length: numberOfRows }).map((_, index) => (
      <TableSkeletonRow key={index} />
    ));

  const memoizedTableSkeleton = useMemo(() => {
    return (
      <Stack sx={{ backgroundColor: 'white' }}>
        <Stack sx={{ padding: '20px' }}>
          <Stack
            direction={'row'}
            sx={{
              paddingX: '40px',
              height: '45px',
              justifyContent: 'center',
              gap: '4px',
              alignItems: 'center',
              marginBottom: '10px',
              backgroundColor: '#1218281c',
              ...sx,
            }}
          >
            {showRows()}
          </Stack>

          <Stack
            direction={'row'}
            sx={{
              paddingX: '40px',
              height: '45px',
              justifyContent: 'center',
              gap: '4px',
              alignItems: 'center',
              marginBottom: '10px',
              backgroundColor: '#1218281c',
              ...sx,
            }}
          >
            {showRows()}
          </Stack>

          <Stack
            direction={'row'}
            sx={{
              paddingX: '40px',
              height: '45px',
              justifyContent: 'center',
              gap: '4px',
              alignItems: 'center',
              marginBottom: '10px',
              backgroundColor: '#1218281c',
              ...sx,
            }}
          >
            {showRows()}
          </Stack>

          <Stack
            direction={'row'}
            sx={{
              paddingX: '40px',
              height: '45px',
              justifyContent: 'center',
              gap: '4px',
              alignItems: 'center',
              marginBottom: '10px',
              backgroundColor: '#1218281c',
              ...sx,
            }}
          >
            {showRows()}
          </Stack>

          <Stack
            direction={'row'}
            sx={{
              paddingX: '40px',
              height: '45px',
              justifyContent: 'center',
              gap: '4px',
              alignItems: 'center',
              marginBottom: '10px',
              backgroundColor: '#1218281c',
              ...sx,
            }}
          >
            {showRows()}
          </Stack>
        </Stack>
      </Stack>
    );
  }, [numberOfRows]);
  return memoizedTableSkeleton;
};

export default TableSkeleton;
