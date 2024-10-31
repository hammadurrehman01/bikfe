import { ToastInfo } from 'hooks/useToast';
import { AppProps } from 'next/app';
import { EmotionCache } from '@emotion/react';
import { ReactElement, ReactNode } from 'react';

export interface PageProps {
  showToast: (info: ToastInfo) => void;
}

export type NextPageWithLayout = {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  emotionCache: EmotionCache;
};
