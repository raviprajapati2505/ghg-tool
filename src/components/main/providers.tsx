"use client";

import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store/store';
import { ToastContainer } from 'react-toastify';
import GlobalLoader from '../common/GlobalLoader';

export default function Providers({ children }: { children: React.ReactNode; }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GlobalLoader />
        <ToastContainer />
        {children}
      </PersistGate>
    </ReduxProvider>
  );
}
