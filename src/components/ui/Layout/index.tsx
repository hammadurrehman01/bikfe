import { Box } from '@mui/material';
import { DashboardNavbar, HTMLHeader, Sidebar } from 'components';
import { memo, useState } from 'react';
import { LayoutRoot } from './styled';
type Props = {
  heading?: string;
  children: JSX.Element;
};

const LayoutComponent = (props: Props) => {
  const { heading, children } = props;

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  return (
    <>
      <HTMLHeader heading={heading} />
      <LayoutRoot>
        <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {children}
        </Box>
      </LayoutRoot>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
};

export const Layout = memo(LayoutComponent);
