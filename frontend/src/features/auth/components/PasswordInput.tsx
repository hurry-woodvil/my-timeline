import { ChangeEvent, useState } from 'react';
import { useSignIn } from '../hooks/use-sign-in';

type InputChangeEvent = ChangeEvent<HTMLInputElement, HTMLInputElement>;

export default function PasswordInput() {
  const { setPassword } = useSignIn();
  const [passwd, setPasswd] = useState('');

  const changeHandler = (e: InputChangeEvent) => {
    const val = e.target.value;
    setPasswd(val);
    setPassword(val);
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
        value={passwd}
        onChange={changeHandler}
        autoComplete="current-password"
      />
    </div>
  );
}
