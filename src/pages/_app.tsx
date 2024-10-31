import { CacheProvider } from '@emotion/react';
import { CircularProgress, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { HTMLHeader } from 'components';
import { useToast } from 'hooks/useToast';
import { AppPropsWithLayout } from 'interface/pages';
import NextNProgress from 'nextjs-progressbar';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import store from 'redux/store';
import { theme } from 'theme';
import { createEmotionCache } from '../theme/utils/emotion-cache';
import './global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const clientSideEmotionCache = createEmotionCache();
function App({ Component, pageProps, ...rest }: AppPropsWithLayout) {
  const { emotionCache = clientSideEmotionCache } = rest;
  const { Toast, handleClick } = useToast();
  const getLayout = Component.getLayout ?? (page => page);
  const persistor = persistStore(store);
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate
            loading={
              <div
                style={{
                  width: '100%',
                  height: '90vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {' '}
                <CircularProgress />
              </div>
            }
            persistor={persistor}
          >
            <HTMLHeader />
            <CacheProvider value={emotionCache}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <ToastContainer
                  position="top-center"
                  autoClose={5000}
                  hideProgressBar
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />

                {getLayout(
                  <Component {...pageProps} showToast={handleClick} />,
                )}
                <span style={{ zIndex: 100000 }}>
                  <NextNProgress
                    color="#111827"
                    height={5}
                    showOnShallow
                    options={{ easing: 'ease', speed: 500 }}
                  />
                </span>
              </ThemeProvider>
            </CacheProvider>
            <Toast />
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;
