type EmailInputProps = {
  email: string;
  setEmail: (value: string) => void;
};

export default function EmailInput({ email, setEmail }: EmailInputProps) {
  return (
    <div className="mb-3">
      <label htmlFor="email" className="block text-sm">
        Email
      </label>
      <input
        id="email"
        type="email"
        className="w-full border p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
    </div>
  );
}
