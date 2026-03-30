import { AppRouter } from '@/routes';
import { AppProvider, AuthProvider } from '@/contexts';
import { TooltipProvider } from '@/lib/components/ui/tooltip';

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <TooltipProvider>
          <AppRouter />
        </TooltipProvider>
      </AuthProvider>
    </AppProvider>
  );
}
