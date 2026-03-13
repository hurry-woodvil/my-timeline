import { useSignIn } from '../hooks/useSignIn';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import ErrorMessage from '../components/ErrorMessage';
import SubmitButton from '../components/SubmitButton';

export default function SignInPage() {
  const {
    email,
    password,
    isSubmitting,
    errorMessage,
    setEmail,
    setPassword,
    handleSubmit,
  } = useSignIn();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-96 rounded border p-6 shadow">
        <h1 className="mb-4 text-xl font-bold">Sign In</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <EmailInput email={email} setEmail={setEmail} />
          <PasswordInput password={password} setPassword={setPassword} />
          <ErrorMessage errorMessage={errorMessage} />
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  );
}
