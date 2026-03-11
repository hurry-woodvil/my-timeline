import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInPage from '../pages/signin/SignInPage';
import Home from '../pages/Home';

export default function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignInPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
