import { memo } from 'react';
import { Paper, SxProps, Theme } from '@mui/material';

type Props = {
  children?: JSX.Element | JSX.Element[];
  sx?: SxProps<Theme>;
  elevation?: number;
  variant?: 'elevation' | 'outlined';
};

const CardComponent = ({ children, ...rest }: Props) => {
  return <Paper {...rest}>{children}</Paper>;
};

export const Card = memo(CardComponent);
