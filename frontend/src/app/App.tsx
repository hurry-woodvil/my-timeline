import { AppRouter } from '@/routes';
import { AuthProvider } from '@/contexts';
import { TooltipProvider } from '@/lib/components/ui/tooltip';

export default function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <AppRouter />
      </TooltipProvider>
    </AuthProvider>
  );
}
