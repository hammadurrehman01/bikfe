import { Box, ListItem } from '@mui/material';
import { AppButton } from 'components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { theme } from 'theme';

type Props = {
  href: string;
  icon?: JSX.Element;
  title: string;
  setSidebarOpen: (value: boolean) => void;
};

export function NavItem(props: Props) {
  const router = useRouter();

  const { href, icon, title, setSidebarOpen } = props;

  const active = href ? router.pathname === href : false;

  return (
    <ListItem disableGutters onClick={() => setSidebarOpen(false)}>
      <Link href={href} passHref>
        <AppButton
          fullWidth
          startIcon={icon}
          sx={{
            backgroundColor: active ? 'rgba(255,255,255, 0.08)' : 'transparent',
            color: active
              ? theme.palette.secondary.main
              : theme.palette.text.secondary,
            fontWeight: active ? 'fontWeightBold' : 'fontWeightSemiBold',
            textAlign: 'left',
            '& .MuiButton-startIcon': {
              color: active
                ? theme.palette.secondary.main
                : theme.palette.text.secondary,
            },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255, 0.08)',
            },
          }}
        >
          <Box sx={{ flexGrow: 1, fontWeight: 'bold' }}>{title}</Box>
        </AppButton>
      </Link>
    </ListItem>
  );
}
