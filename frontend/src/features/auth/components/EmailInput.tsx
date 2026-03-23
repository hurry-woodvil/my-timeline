import { ChangeEvent, useState } from 'react';
import { useSignIn } from '../hooks/use-sign-in';

type InputChangeEvent = ChangeEvent<HTMLInputElement, HTMLInputElement>;

export default function EmailInput() {
  const { setEmail } = useSignIn();
  const [inputEmail, setInputEmail] = useState('');

  const changeHandler = (e: InputChangeEvent) => {
    const val = e.target.value;
    setInputEmail(val);
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
        value={inputEmail}
        onChange={changeHandler}
        autoComplete="email"
      />
    </div>
  );
}
