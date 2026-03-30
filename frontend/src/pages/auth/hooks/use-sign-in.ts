import { useState } from 'react';
import { signin as signinService } from '@/features/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function useSignIn() {
  const navigate = useNavigate();
  const { signin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const result = await signinService(email, password);
      if (!result) {
        console.log('signin failed');
      }
      signin(result.data);
      navigate('/timeline');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to sign in.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    password,
    isSubmitting,
    errorMessage,
    setEmail,
    setPassword,
    handleSubmit,
  };
}
