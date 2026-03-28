import { Outlet } from 'react-router-dom';
import { Header, Background } from './components';

export default function Layout() {
  return (
    <main className="min-h-screen">
      <div className="relative min-h-screen overflow-hidden">
        <Header />
        <div className="relative z-10 mx-auto min-h-screen max-w-7xl p-4">
          <Outlet />
        </div>
        <Background />
      </div>
    </main>
  );
}
