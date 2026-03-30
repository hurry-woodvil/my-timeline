import { useSignUp } from '../hooks/use-sign-up';
import EmailInput from './EmailInput';
import ErrorMessage from './ErrorMessage';
import PasswordInput from './PasswordInput';
import SubmitButton from './SubmitButton';

export default function SingUpForm() {
  const {
    email,
    password,
    isSubmitting,
    errorMessage,
    setEmail,
    setPassword,
    handleSubmit,
  } = useSignUp();

  return (
    <>
      <h1 className="mb-4 text-xl font-bold">Sign Up</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <EmailInput email={email} setEmail={setEmail} />
        <PasswordInput password={password} setPassowrd={setPassword} />
        <ErrorMessage errorMessage={errorMessage} />
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </>
  );
}
