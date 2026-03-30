import { Outlet } from 'react-router-dom';
import { Header, Background } from './components';

export default function Layout() {
  return (
    <main className="min-h-screen">
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        <Header />

        <div className="relative z-10 flex flex-1 min-h-0 w-full items-stretch px-4 pb-4 pt-4">
          <div className="flex-1 min-h-0">
            <Outlet />
          </div>
        </div>

        <Background />
      </div>
    </main>
  );
}
