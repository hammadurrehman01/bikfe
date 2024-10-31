import { Button, SxProps, Theme } from '@mui/material';
import { ReactNode, forwardRef, memo } from 'react';

type Props = {
  title?: string | ReactNode;
  children?: string | JSX.Element;
  startIcon?: JSX.Element;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  endIcon?: JSX.Element;
  sx?: SxProps<Theme>;
  type?: 'submit' | 'reset' | 'button';
  variant?: 'text' | 'contained' | 'outlined';
  className?: string;
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  size?: 'large' | 'medium' | 'small';
  id?: any;
};

const AppButtonComponent = (
  {
    sx,
    title,
    endIcon,
    onClick,
    children,
    className,
    startIcon,
    fullWidth,
    size = 'medium',
    type = 'button',
    variant = 'contained',
    color = 'primary',
    id,
  }: Props,
  ref: React.Ref<HTMLButtonElement>,
) => {
  return (
    <Button
      {...{
        sx,
        type,
        size,
        color,
        variant,
        endIcon,
        onClick,
        className,
        fullWidth,
        startIcon,
        ref,
        id,
      }}
    >
      {title ?? children}
    </Button>
  );
};

export const AppButton = memo(forwardRef(AppButtonComponent));
