import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { NavItem } from '../Sidebar/item';
import { theme } from 'theme';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(0),
  paddingBottom: theme.spacing(0),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
type listobj = {
  href: string;
  icon: JSX.Element;
  title: string;
};
type Props = {
  setSidebarOpen: (value: boolean) => void;
  row: {
    title: string;
    list?: listobj[];
    href?: string;
    icon?: JSX.Element;
  };
};

export default function CustomizedAccordions({ row, setSidebarOpen }: Props) {
  const [expanded, setExpanded] = React.useState<string | false>('');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <div>
      {row.list ? (
        <Accordion
          style={{ backgroundColor: '#111827', color: 'white' }}
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary
            style={{ backgroundColor: '#111827', color: 'white' }}
            aria-controls="panel1d-content"
            id="panel1d-header"
          >
            <Typography
              sx={{
                fontWeight: 'fontWeightBold',
                backgroundColor: 'transparent',
                color: theme.palette.text.secondary,
              }}
            >
              {row?.title}
            </Typography>
          </AccordionSummary>
          {row.list && (
            <AccordionDetails
              style={{ backgroundColor: '#111827', color: 'white' }}
            >
              {row.list.map((item, i) => {
                return (
                  <NavItem
                    key={i}
                    icon={item.icon}
                    href={item.href}
                    title={item.title}
                    setSidebarOpen={setSidebarOpen}
                  />
                );
              })}
            </AccordionDetails>
          )}
        </Accordion>
      ) : (
        <div style={{ paddingLeft: '15px', paddingRight: '10px' }}>
          {' '}
          <NavItem
            href={row.href ?? ''}
            title={row.title}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      )}
    </div>
  );
}
