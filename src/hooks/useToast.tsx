import { useCallback, useState } from 'react';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

export interface State extends SnackbarOrigin {
  open: boolean;
}

export type ToastInfo = {
  message: string;
  level: 'error' | 'success' | 'info' | 'warning';
};

export function useToast() {
  const [state, setState] = useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });

  const [toastInfo, setToastInfo] = useState<ToastInfo>({
    level: 'success',
    message: '',
  });

  const handleClick = useCallback((info: ToastInfo) => {
    setToastInfo(info);
    setState(prevState => ({ ...prevState, open: true }));
  }, []);

  const handleClose = useCallback(() => {
    setState(prevState => ({ ...prevState, open: false }));
  }, []);

  const { vertical, horizontal, open } = state;

  const Toast = () => (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert onClose={handleClose} severity={toastInfo.level}>
        {toastInfo.message}
      </Alert>
    </Snackbar>
  );

  return {
    handleClick,
    Toast,
  };
}
