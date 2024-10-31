import SignalCellularAlt2BarIcon from '@mui/icons-material/SignalCellularAlt2Bar';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import {
  BILL_ADD_URL,
  BILL_LIST_URL,
  CUSTOMER_ADD_URL,
  CUSTOMER_LIST_URL,
  INVOICE_ADD_URL,
  INVOICE_LIST_URL,
  PRODUCT_ADD_URL,
  PRODUCT_LIST_URL,
  ROOT_URL,
  VENDOR_ADD_URL,
  VENDOR_LIST_URL,
} from 'routes';

export const MENU = [
  {
    href: ROOT_URL,
    icon: <SignalCellularAlt2BarIcon />,
    title: 'Dashboard',
  },
  {
    title: 'Customer',
    list: [
      {
        href: CUSTOMER_ADD_URL,
        icon: <AddIcon />,
        title: 'Add',
      },
      {
        href: CUSTOMER_LIST_URL,
        icon: <ListAltIcon />,
        title: 'list',
      },
    ],
  },
  {
    title: 'Vendor',
    list: [
      {
        href: VENDOR_ADD_URL,
        icon: <AddIcon />,
        title: 'Add',
      },
      {
        href: VENDOR_LIST_URL,
        icon: <ListAltIcon />,
        title: 'list',
      },
    ],
  },
  {
    title: 'Product',
    list: [
      {
        href: PRODUCT_ADD_URL,
        icon: <AddIcon />,
        title: 'Add',
      },
      {
        href: PRODUCT_LIST_URL,
        icon: <ListAltIcon />,
        title: 'list',
      },
    ],
  },
  {
    title: 'Invoice',
    list: [
      {
        href: INVOICE_ADD_URL,
        icon: <AddIcon />,
        title: 'Add',
      },
      {
        href: INVOICE_LIST_URL,
        icon: <ListAltIcon />,
        title: 'list',
      },
    ],
  },
  {
    title: 'Bill',
    list: [
      {
        href: BILL_ADD_URL,
        icon: <AddIcon />,
        title: 'Add',
      },
      {
        href: BILL_LIST_URL,
        icon: <ListAltIcon />,
        title: 'list',
      },
    ],
  },
];
