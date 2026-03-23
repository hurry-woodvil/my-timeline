import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthPage, GuestRoute, ProtectedRoute } from '../features/auth';
import { TimelinePage } from '../features/timeline';

export default function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth"
            element={
              <GuestRoute>
                <AuthPage />
              </GuestRoute>
            }
          />
          <Route
            path="/timeline"
            element={
              <ProtectedRoute>
                <TimelinePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
