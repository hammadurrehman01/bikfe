import { memo } from 'react';
import Head from 'next/head';

type Props = {
  heading?: string;
};

function HTMLHeaderComponent({ heading = '' }: Props) {
  return (
    <Head>
      <title>AfterMarket</title>
    </Head>
  );
}

export const HTMLHeader = memo(HTMLHeaderComponent);
