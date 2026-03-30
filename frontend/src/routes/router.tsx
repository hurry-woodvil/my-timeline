import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout, AuthLayout } from '@/layouts';
import { AuthPage, HomePage } from '@/pages';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [{ path: '/', element: <HomePage /> }],
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
