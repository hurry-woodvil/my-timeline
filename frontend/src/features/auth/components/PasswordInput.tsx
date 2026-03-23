type ChangeEvent = React.ChangeEvent<HTMLInputElement, HTMLInputElement>;

type PasswordInputProps = {
  password: string;
  setPassowrd: (password: React.SetStateAction<string>) => void;
};

export default function PasswordInput({
  password,
  setPassowrd,
}: PasswordInputProps) {
  const changeHandler = (e: ChangeEvent) => {
    const val = e.target.value;
    setPassowrd(val);
  };

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
        onChange={changeHandler}
        autoComplete="current-password"
      />
    </div>
  );
}
