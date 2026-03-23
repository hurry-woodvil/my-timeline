import { useAuth } from '../../auth/contexts/AuthContext';

export default function TimelinePage() {
  const { signout } = useAuth();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Timeline</h1>
          <p className="text-sm text-gray-600">
            Signed in as &lt;ここに名前&gt;
          </p>
        </div>
        <button
          className="rounded-md border border-gray-300 px-4 py-2"
          onClick={signout}
        >
          Sign Out
        </button>
        <section className="rounded-xl border border-gray-200 p-4">
          <p>ここに投稿一覧が入ります。</p>
        </section>
      </div>
    </main>
  );
}
