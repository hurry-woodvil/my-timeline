type SubmitButtonProps = {
  isSubmitting: boolean;
};

export default function SubmitButton({ isSubmitting }: SubmitButtonProps) {
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
