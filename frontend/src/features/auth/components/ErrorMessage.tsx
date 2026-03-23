import { useSignIn } from '../hooks/use-sign-in';

export default function ErrorMessage() {
  const { errorMessage } = useSignIn();
  return (
    <>
      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </>
  );
}
