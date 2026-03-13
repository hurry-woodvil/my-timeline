import AppRouter from './router';
import { AuthProvider } from '../features/auth/contexts/AuthContext';

export default function App() {
  return (
    <main>
      <div>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </div>
    </main>
  );
}
