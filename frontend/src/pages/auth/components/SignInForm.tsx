import { useSignIn } from '../hooks/use-sign-in';
import EmailInput from './EmailInput';
import ErrorMessage from './ErrorMessage';
import PasswordInput from './PasswordInput';
import SubmitButton from './SubmitButton';

export default function SignInForm() {
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
    <>
      <h1 className="mb-4 text-xl font-bold">Sign In</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <EmailInput email={email} setEmail={setEmail} />
        <PasswordInput password={password} setPassowrd={setPassword} />
        <ErrorMessage errorMessage={errorMessage} />
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </>
  );
}
