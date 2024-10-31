import { memo } from 'react';
import { Modal, Stack, Typography, Button } from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  handleDelete?: () => void;
  text?: string;
  cancelBtn?: string;
  confirmBtn?: string;
  children?: JSX.Element;
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '1rem',
};

const AppModalComponent = ({
  open,
  onClose,
  text,
  cancelBtn,
  confirmBtn,
  handleDelete,
  children,
}: Props) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {children ? (
        children
      ) : (
        <Stack sx={style}>
          <Typography sx={{ textAlign: 'center' }} variant="h6" component="h2">
            {text}
          </Typography>
          <Stack
            direction={'row'}
            gap={'10px'}
            sx={{
              width: '100%',
              gap: '10px',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '1.5rem',
            }}
          >
            <Button
              onClick={handleDelete}
              sx={{
                width: '40%',
                backgroundColor: '#5048e5',
                color: 'white',
                '&:hover': { backgroundColor: '#3831b1' },
              }}
            >
              {confirmBtn}
            </Button>
            <Button
              onClick={onClose}
              sx={{
                width: '40%',
                backgroundColor: '#5048e5',
                color: 'white',
                '&:hover': { backgroundColor: '#3831b1' },
              }}
            >
              {cancelBtn}
            </Button>
          </Stack>
        </Stack>
      )}
    </Modal>
  );
};

export const AppModal = memo(AppModalComponent);
