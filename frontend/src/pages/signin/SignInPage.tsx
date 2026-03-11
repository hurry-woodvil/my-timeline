import { useSignIn } from './useSignIn';

export default function SignInPage() {
  const { email, password, setEmail, setPassword, handleSubmit } = useSignIn();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-96 rounded border p-6 shadow">
        <h1 className="mb-4 text-xl font-bold">Sign In</h1>
        <div className="mb-3">
          <label className="block text-sm">Email</label>
          <input
            type="email"
            className="w-full border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm">Password</label>
          <input
            type="password"
            className="w-full border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-blue-500 p-2 text-white"
          onClick={handleSubmit}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
