type PasswordInputProps = {
  password: string;
  setPassword: (value: string) => void;
};

export default function PasswordInput({
  password,
  setPassword,
}: PasswordInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor="password" className="block text-sm">
        Password
      </label>
      <input
        id="password"
        type="password"
        className="w-full border p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
    </div>
  );
}
