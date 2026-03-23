import { useSignIn } from '../hooks/useSignIn';
import SignInForm from '../components/SignInForm';
import { useState } from 'react';
import SingUpForm from '../components/SignUpForm';

export default function SignInPage() {
  const {
    email,
    password,
    isSubmitting,
    errorMessage,
    setEmail,
    setPassword,
    handleSubmit,
  } = useSignIn();
  const [isSignIn, setIsSignIn] = useState(true);

  const onClickHandler = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-96 rounded border p-6 shadow">
        {isSignIn ? (
          <SignInForm
            email={email}
            password={password}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            setEmail={setEmail}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
          />
        ) : (
          <SingUpForm />
        )}
        <button onClick={onClickHandler}>Sing Up</button>
      </div>
    </div>
  );
}
