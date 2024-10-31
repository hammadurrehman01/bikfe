import { Button, Stack } from '@mui/material';

interface Iprops {
  isNext: boolean;
  isPrevious: boolean;
  handlePrevious: () => void;
  handleNext: () => void;
}

export const PaginationBar = (props: Iprops) => {
  const { isNext, isPrevious, handlePrevious, handleNext } = props;
  return (
    <Stack direction={'row'} justifyContent={'space-between'}>
      <Button disabled={!isPrevious} onClick={handlePrevious}>
        PREVIOUS
      </Button>
      <Button disabled={!isNext} onClick={handleNext}>
        NEXT
      </Button>
    </Stack>
  );
};
