import { createContext, ReactNode, useContext, useMemo } from 'react';
import { ApiClient } from '@/lib';
import { env } from '@/config/env';

type AppContextValue = {
  apiClient: ApiClient;
};

const AppContext = createContext<AppContextValue | null>(null);

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const apiClient = new ApiClient(env.apiBaseUrl);

  const value = useMemo<AppContextValue>(() => ({ apiClient }), []);

  return <AppContext value={value}>{children}</AppContext>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used with AppProvider');
  }

  return context;
}
