import { useState } from 'react';
import SignInForm from '../components/SignInForm';
import SingUpForm from '../components/SignUpForm';

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  const onClickHandler = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-96 rounded border p-6 shadow">
        {isSignIn ? <SignInForm /> : <SingUpForm />}
        <button
          className="w-full bg-blue-500 p-2 text-white"
          onClick={onClickHandler}
        >
          {isSignIn ? 'Sing Up' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}
