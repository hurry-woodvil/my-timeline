import { useSignIn } from '../hooks/use-sign-in';

export default function SubmitButton() {
  const { isSubmitting } = useSignIn();

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-blue-500 p-2 text-white"
    >
      {isSubmitting ? 'Signing In...' : 'Sign In'}
    </button>
  );
}
