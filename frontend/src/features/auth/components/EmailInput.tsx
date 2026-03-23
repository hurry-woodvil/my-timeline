type ChangeEvent = React.ChangeEvent<HTMLInputElement, HTMLInputElement>;

type EmailInputProps = {
  email: string;
  setEmail: (email: React.SetStateAction<string>) => void;
};

export default function EmailInput({ email, setEmail }: EmailInputProps) {
  const changeHandler = (e: ChangeEvent) => {
    const val = e.target.value;
    setEmail(val);
  };

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
        onChange={changeHandler}
        autoComplete="email"
      />
    </div>
  );
}
