import { useSignIn } from '../hooks/use-sign-in';
import EmailInput from './EmailInput';
import ErrorMessage from './ErrorMessage';
import PasswordInput from './PasswordInput';
import SubmitButton from './SubmitButton';

type SignInFromProps = {
  isSubmitting: boolean;
  errorMessage: string;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
};

export default function SignInForm({
  isSubmitting,
  errorMessage,
  handleSubmit,
}: SignInFromProps) {
  return (
    <>
      <h1 className="mb-4 text-xl font-bold">Sign In</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <EmailInput />
        <PasswordInput />
        <ErrorMessage errorMessage={errorMessage} />
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </>
  );
}
