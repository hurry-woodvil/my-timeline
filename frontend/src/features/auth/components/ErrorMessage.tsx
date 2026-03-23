type ErrorMessageProps = {
  errorMessage: string;
};
import { useSignIn } from '../hooks/use-sign-in';

export default function ErrorMessage({ errorMessage }: ErrorMessageProps) {
  return (
    <>
      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </>
  );
}
