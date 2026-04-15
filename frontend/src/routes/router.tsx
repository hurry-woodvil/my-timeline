import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout, AuthLayout } from '@/layouts';
import { AuthPage, HomePage, MemoryDetailPage } from '@/pages';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        {
          path: '/',
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/memory/:memory_id',
          element: (
            <ProtectedRoute>
              <MemoryDetailPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      element: <AuthLayout />,
      children: [
        {
          path: '/auth',
          element: (
            <GuestRoute>
              <AuthPage />
            </GuestRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
