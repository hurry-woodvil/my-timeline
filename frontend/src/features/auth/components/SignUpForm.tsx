import { useSignIn } from '../hooks/use-sign-in';
import EmailInput from './EmailInput';
import ErrorMessage from './ErrorMessage';
import PasswordInput from './PasswordInput';
import SubmitButton from './SubmitButton';

export default function SingUpForm() {
  const { handleSubmit } = useSignIn();

  return (
    <>
      <h1 className="mb-4 text-xl font-bold">Sign Up</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <EmailInput />
        <PasswordInput />
        <ErrorMessage />
        <SubmitButton />
      </form>
    </>
  );
}
