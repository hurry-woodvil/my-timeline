import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignInPage, GuestRoute, ProtectedRoute } from '../features/auth';
import { TimelinePage } from '../features/timeline';

export default function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/signin"
            element={
              <GuestRoute>
                <SignInPage />
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
