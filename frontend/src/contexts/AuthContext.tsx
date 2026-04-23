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
  signin as signinService,
  signup as signupService,
  signout as signoutSevice,
} from '@/features/auth';

const ACCESS_TOKEN_KEY = 'access_token';

type AuthContextValue = AuthState & {
  isInitializing: boolean;
  signin: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
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

  const signin = async (email: string, password: string) => {
    try {
      const result = await signinService(email, password);

      if (result.success) {
        const token = result.data.accessToken;
        setToken(token);
      } else {
        throw new Error(result.message);
      }
    } catch (e) {
      removeToken();
      throw e;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const result = await signupService(email, password);

      if (result.success) {
        const token = result.data.accessToken;
        setToken(token);
      } else {
        throw new Error(result.message);
      }
    } catch (e) {
      removeToken();
      throw e;
    }
  };

  const signout = async () => {
    const body = await signoutSevice();

    console.log(body.message);

    removeToken();
  };

  const setToken = (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    setAccessToken(token);
  };

  const removeToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setAccessToken(null);
  };

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
