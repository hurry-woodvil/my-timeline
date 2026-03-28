import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthPage, GuestRoute, ProtectedRoute } from '../features/auth';
import { TimelinePage } from '../features/timeline';

import { RootLayout } from '@/layouts';
import { HomePage } from '@/pages';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [{ path: '/', element: <HomePage /> }],
  },
  // {
  //   path: 'auth',
  //   element: (
  //     <GuestRoute>
  //       <AuthPage />
  //     </GuestRoute>
  //   ),
  // },
  // {
  //   path: '/timeline',
  //   element: (
  //     <ProtectedRoute>
  //       <TimelinePage />
  //     </ProtectedRoute>
  //   ),
  // },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
