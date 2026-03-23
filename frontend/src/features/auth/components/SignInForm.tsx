import EmailInput from './EmailInput';
import ErrorMessage from './ErrorMessage';
import PasswordInput from './PasswordInput';
import SubmitButton from './SubmitButton';

type SignInFromProps = {
  email: string;
  password: string;
  isSubmitting: boolean;
  errorMessage: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
};

export default function SignInForm({
  email,
  password,
  isSubmitting,
  errorMessage,
  setEmail,
  setPassword,
  handleSubmit,
}: SignInFromProps) {
  return (
    <>
      <h1 className="mb-4 text-xl font-bold">Sign In</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <EmailInput email={email} setEmail={setEmail} />
        <PasswordInput password={password} setPassword={setPassword} />
        <ErrorMessage errorMessage={errorMessage} />
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </>
  );
}
