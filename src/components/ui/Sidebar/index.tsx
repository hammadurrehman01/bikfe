import { theme } from 'theme';
import { MENU } from './list';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Divider,
  Drawer,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { AppButton } from 'components/common/Button';
import CustomizedAccordions from '../sidebarbutton';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { LOGIN_URL } from 'routes';
import { setUserDetails } from 'redux/slices/user.slice';
import AuthService from 'services/login';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AppModal } from 'components/common/Modal';

type Props = {
  onClose?: () => void;
  isSidebarOpen?: boolean;
  setSidebarOpen: (value: boolean) => void;
};

const SidebarComponent = (props: Props) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const { isSidebarOpen, onClose, setSidebarOpen } = props;

  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(() => {
    if (!router.isReady) return;
  }, [router.asPath]);
  const isLogin = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (isLogin.key == null) {
      router.push(LOGIN_URL);
    }
  }, [isLogin, router]);
  const queryClient = useQueryClient();
  const auth = new AuthService();
  const SignOut = useMutation({
    mutationFn: async () => await auth.HandleLogout(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['login'] });
      dispatch(
        setUserDetails({
          id: null,
          email: null,
          key: null,
        }),
      );
      router.push('/login');
      toast.success('Logout Successfully');
    },
    onError: () => {
      dispatch(
        setUserDetails({
          id: null,
          email: null,
          key: null,
        }),
      );
      router.push('/login');
      toast.error('You are being redirected to login page');
    },
  });

  const logout = async () => {
    SignOut.mutate();
  };

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              px: 3,
              py: '11px',
              borderRadius: 1,
            }}
          >
            <div>
              <Typography color="inherit" variant="subtitle1">
                AfterMarket
              </Typography>
            </div>
          </Box>
          <Divider
            sx={{
              borderColor: '#2D3748',
              py: 1,
            }}
          />
        </Box>
      </div>

      <Box sx={{ flexGrow: 1 }}>
        {MENU.map((item, i) => (
          <CustomizedAccordions
            key={i}
            row={item}
            setSidebarOpen={setSidebarOpen}
          />
        ))}
      </Box>

      <Box
        sx={{
          px: 2,
          py: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            mt: 2,
            mx: 'auto',
            width: '160px',
            '& img': {
              width: '100%',
            },
          }}
        ></Box>
        {SignOut.isPending ? (
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <AppButton
              fullWidth
              color="error"
              sx={{ mt: 2 }}
              endIcon={<LogoutIcon />}
              onClick={handleOpen}
              title={'SIGN OUT'}
            />
          </>
        )}
      </Box>
      <AppModal
        handleDelete={() => logout()}
        open={open}
        onClose={handleClose}
        text="Are you sure you want to signout"
        cancelBtn="Cancel"
        confirmBtn="Signout"
      />
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={onClose}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.divider,
            color: '#FFFFFF',
            width: 200,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={isSidebarOpen}
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.divider,
          color: '#FFFFFF',
          width: 200,
        },
      }}
      sx={{ zIndex: theme => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

export const Sidebar = memo(SidebarComponent);
