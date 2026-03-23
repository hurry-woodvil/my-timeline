type ErrorMessageProps = {
  errorMessage: string;
};

export default function ErrorMessage({ errorMessage }: ErrorMessageProps) {
  return (
    <>
      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </>
  );
}
