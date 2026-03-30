import {
  ReactNode,
  useState,
  createContext,
  useMemo,
  useContext,
  useEffect,
} from 'react';
import {
  AuthState,
  AuthToken,
  signout as signoutSevice,
} from '@/features/auth';

const ACCESS_TOKEN_KEY = 'access_token';

type AuthContextValue = AuthState & {
  isInitializing: boolean;
  signin: (payload: AuthToken) => void;
  signup: (payload: AuthToken) => void;
  signout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const isAuthenticated = !!accessToken;

  useEffect(() => {
    const savedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    setAccessToken(savedToken);
    setIsInitializing(false);
  }, []);

  function signin(payload: AuthToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, payload.access_token);

    setAccessToken(payload.access_token);
  }

  function signup(payload: AuthToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, payload.access_token);

    setAccessToken(payload.access_token);
  }

  async function signout() {
    const body = await signoutSevice();

    console.log(body.message);

    localStorage.removeItem(ACCESS_TOKEN_KEY);

    setAccessToken(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      accessToken,
      isInitializing,
      signin,
      signup,
      signout,
    }),
    [isAuthenticated, accessToken, isInitializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used with AuthProvider');
  }

  return context;
}
