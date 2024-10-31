import NextLink from 'next/link';
import { HTMLAttributeAnchorTarget, memo } from 'react';
import { Link as MUILink, SxProps, Theme } from '@mui/material';

type Props = {
  text: string;
  href: string;
  sx?: SxProps<Theme>;
  target?: HTMLAttributeAnchorTarget;
};

const LinkComponent = ({ target, href, text, sx }: Props) => {
  return (
    <NextLink passHref prefetch={false} href={href}>
      <MUILink
        variant="subtitle2"
        target={target}
        underline="hover"
        {...{ sx }}
      >
        {text}
      </MUILink>
    </NextLink>
  );
};

export const Link = memo(LinkComponent);
